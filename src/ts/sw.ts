/// <reference lib="webworker" />

const sw: ServiceWorkerGlobalScope = self as any;

sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim());
});

// Map to store pending requests (Correlation ID -> Resolver)
const pendingRequests = new Map<string, (response: Response) => void>();

sw.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept requests targeting the preview scope
  // We'll use a specific path prefix to identify these requests
  if (url.pathname.includes('/swo-preview/')) {
    event.respondWith(handlePreviewRequest(event));
  }
});

async function handlePreviewRequest(event: FetchEvent): Promise<Response> {
  const urlObj = new URL(event.request.url);
  const instanceId = urlObj.searchParams.get('instanceId');
  
  const allClients = await sw.clients.matchAll({ type: 'window' });
  
  if (allClients.length === 0) {
    return new Response("SWO: No editor clients found. Please reload.", { status: 503 });
  }

  const requestId = Math.random().toString(36).substring(2);
  const path = urlObj.pathname;

  // Create a promise that will be resolved when the client replies
  const responsePromise = new Promise<Response>((resolve) => {
    pendingRequests.set(requestId, resolve);
    
    // Safety timeout
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        resolve(new Response("SWO: Request timeout. Editor did not respond.", { status: 504 }));
      }
    }, 5000);
  });

  // Broadcast request to all clients
  // The client with the matching instanceId will respond
  for (const client of allClients) {
      client.postMessage({
        type: 'SWO_FILE_REQUEST',
        path: path,
        requestId: requestId,
        targetInstanceId: instanceId
      });
  }

  return responsePromise;
}

sw.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SWO_FILE_RESPONSE') {
    const { requestId, content, mimeType, status } = event.data;
    
    const resolve = pendingRequests.get(requestId);
    if (resolve) {
      pendingRequests.delete(requestId);
      
      const headers = new Headers();
      if (mimeType) headers.set('Content-Type', mimeType);
      
      resolve(new Response(content, { 
        status: status || 200, 
        headers: headers 
      }));
    }
  }
});
