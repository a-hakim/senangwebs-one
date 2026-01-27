(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SWO"] = factory();
	else
		root["SWO"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 204:
/***/ (function() {


/// <reference lib="webworker" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const sw = self;
sw.addEventListener('install', (event) => {
    event.waitUntil(sw.skipWaiting());
});
sw.addEventListener('activate', (event) => {
    event.waitUntil(sw.clients.claim());
});
// Map to store pending requests (Correlation ID -> Resolver)
const pendingRequests = new Map();
sw.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    // Intercept requests targeting the preview scope
    // We'll use a specific path prefix to identify these requests
    if (url.pathname.includes('/swo-preview/')) {
        event.respondWith(handlePreviewRequest(event));
    }
});
function handlePreviewRequest(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlObj = new URL(event.request.url);
        const instanceId = urlObj.searchParams.get('instanceId');
        const allClients = yield sw.clients.matchAll({ type: 'window' });
        if (allClients.length === 0) {
            return new Response("SWO: No editor clients found. Please reload.", { status: 503 });
        }
        const requestId = Math.random().toString(36).substring(2);
        const path = urlObj.pathname;
        // Create a promise that will be resolved when the client replies
        const responsePromise = new Promise((resolve) => {
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
    });
}
sw.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SWO_FILE_RESPONSE') {
        const { requestId, content, mimeType, status } = event.data;
        const resolve = pendingRequests.get(requestId);
        if (resolve) {
            pendingRequests.delete(requestId);
            const headers = new Headers();
            if (mimeType)
                headers.set('Content-Type', mimeType);
            resolve(new Response(content, {
                status: status || 200,
                headers: headers
            }));
        }
    }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[204]();
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=sw.js.map