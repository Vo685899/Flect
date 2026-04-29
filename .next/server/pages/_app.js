/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/AuthContext.js":
/*!****************************!*\
  !*** ./lib/AuthContext.js ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./supabase */ \"./lib/supabase.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_supabase__WEBPACK_IMPORTED_MODULE_2__]);\n_supabase__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [profile, setProfile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        _supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession().then(({ data: { session } })=>{\n            setUser(session?.user ?? null);\n            if (session?.user) fetchProfile(session.user.id);\n            else setLoading(false);\n        });\n        const { data: { subscription } } = _supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.onAuthStateChange((_e, session)=>{\n            setUser(session?.user ?? null);\n            if (session?.user) fetchProfile(session.user.id);\n            else {\n                setProfile(null);\n                setLoading(false);\n            }\n        });\n        return ()=>subscription.unsubscribe();\n    }, []);\n    const fetchProfile = async (uid)=>{\n        const { data } = await _supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.from(\"profiles\").select(\"*\").eq(\"id\", uid).single();\n        setProfile(data);\n        setLoading(false);\n    };\n    const refreshProfile = async ()=>{\n        if (user) {\n            const { data } = await _supabase__WEBPACK_IMPORTED_MODULE_2__.supabase.from(\"profiles\").select(\"*\").eq(\"id\", user.id).single();\n            setProfile(data);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            profile,\n            loading,\n            refreshProfile\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/victoriaolko/Downloads/flect-web-3/lib/AuthContext.js\",\n        lineNumber: 24,\n        columnNumber: 10\n    }, this);\n}\nconst useAuth = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvQXV0aENvbnRleHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBdUU7QUFDakM7QUFDdEMsTUFBTUssNEJBQWNMLG9EQUFhQSxDQUFDLENBQUM7QUFDNUIsU0FBU00sYUFBYSxFQUFFQyxRQUFRLEVBQUU7SUFDdkMsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdOLCtDQUFRQSxDQUFDO0lBQ2pDLE1BQU0sQ0FBQ08sU0FBU0MsV0FBVyxHQUFHUiwrQ0FBUUEsQ0FBQztJQUN2QyxNQUFNLENBQUNTLFNBQVNDLFdBQVcsR0FBR1YsK0NBQVFBLENBQUM7SUFDdkNELGdEQUFTQSxDQUFDO1FBQ1JFLCtDQUFRQSxDQUFDVSxJQUFJLENBQUNDLFVBQVUsR0FBR0MsSUFBSSxDQUFDLENBQUMsRUFBRUMsTUFBTSxFQUFFQyxPQUFPLEVBQUUsRUFBRTtZQUNwRFQsUUFBUVMsU0FBU1YsUUFBUTtZQUN6QixJQUFJVSxTQUFTVixNQUFNVyxhQUFhRCxRQUFRVixJQUFJLENBQUNZLEVBQUU7aUJBQVFQLFdBQVc7UUFDcEU7UUFDQSxNQUFNLEVBQUVJLE1BQU0sRUFBRUksWUFBWSxFQUFFLEVBQUUsR0FBR2pCLCtDQUFRQSxDQUFDVSxJQUFJLENBQUNRLGlCQUFpQixDQUFDLENBQUNDLElBQUlMO1lBQ3RFVCxRQUFRUyxTQUFTVixRQUFRO1lBQ3pCLElBQUlVLFNBQVNWLE1BQU1XLGFBQWFELFFBQVFWLElBQUksQ0FBQ1ksRUFBRTtpQkFBUTtnQkFBRVQsV0FBVztnQkFBT0UsV0FBVztZQUFRO1FBQ2hHO1FBQ0EsT0FBTyxJQUFNUSxhQUFhRyxXQUFXO0lBQ3ZDLEdBQUcsRUFBRTtJQUNMLE1BQU1MLGVBQWUsT0FBT007UUFDMUIsTUFBTSxFQUFFUixJQUFJLEVBQUUsR0FBRyxNQUFNYiwrQ0FBUUEsQ0FBQ3NCLElBQUksQ0FBQyxZQUFZQyxNQUFNLENBQUMsS0FBS0MsRUFBRSxDQUFDLE1BQU1ILEtBQUtJLE1BQU07UUFDakZsQixXQUFXTTtRQUFPSixXQUFXO0lBQy9CO0lBQ0EsTUFBTWlCLGlCQUFpQjtRQUFjLElBQUl0QixNQUFNO1lBQUUsTUFBTSxFQUFFUyxJQUFJLEVBQUUsR0FBRyxNQUFNYiwrQ0FBUUEsQ0FBQ3NCLElBQUksQ0FBQyxZQUFZQyxNQUFNLENBQUMsS0FBS0MsRUFBRSxDQUFDLE1BQU1wQixLQUFLWSxFQUFFLEVBQUVTLE1BQU07WUFBSWxCLFdBQVdNO1FBQU87SUFBRTtJQUM5SixxQkFBTyw4REFBQ1osWUFBWTBCLFFBQVE7UUFBQ0MsT0FBTztZQUFFeEI7WUFBTUU7WUFBU0U7WUFBU2tCO1FBQWU7a0JBQUl2Qjs7Ozs7O0FBQ25GO0FBQ08sTUFBTTBCLFVBQVUsSUFBTWhDLGlEQUFVQSxDQUFDSSxhQUFhIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlY3QvLi9saWIvQXV0aENvbnRleHQuanM/MTJkYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICcuL3N1cGFiYXNlJztcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dCh7fSk7XG5leHBvcnQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfSkge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3Byb2ZpbGUsIHNldFByb2ZpbGVdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHN1cGFiYXNlLmF1dGguZ2V0U2Vzc2lvbigpLnRoZW4oKHsgZGF0YTogeyBzZXNzaW9uIH0gfSkgPT4ge1xuICAgICAgc2V0VXNlcihzZXNzaW9uPy51c2VyID8/IG51bGwpO1xuICAgICAgaWYgKHNlc3Npb24/LnVzZXIpIGZldGNoUHJvZmlsZShzZXNzaW9uLnVzZXIuaWQpOyBlbHNlIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH0pO1xuICAgIGNvbnN0IHsgZGF0YTogeyBzdWJzY3JpcHRpb24gfSB9ID0gc3VwYWJhc2UuYXV0aC5vbkF1dGhTdGF0ZUNoYW5nZSgoX2UsIHNlc3Npb24pID0+IHtcbiAgICAgIHNldFVzZXIoc2Vzc2lvbj8udXNlciA/PyBudWxsKTtcbiAgICAgIGlmIChzZXNzaW9uPy51c2VyKSBmZXRjaFByb2ZpbGUoc2Vzc2lvbi51c2VyLmlkKTsgZWxzZSB7IHNldFByb2ZpbGUobnVsbCk7IHNldExvYWRpbmcoZmFsc2UpOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG4gIGNvbnN0IGZldGNoUHJvZmlsZSA9IGFzeW5jICh1aWQpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oJ3Byb2ZpbGVzJykuc2VsZWN0KCcqJykuZXEoJ2lkJywgdWlkKS5zaW5nbGUoKTtcbiAgICBzZXRQcm9maWxlKGRhdGEpOyBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgfTtcbiAgY29uc3QgcmVmcmVzaFByb2ZpbGUgPSBhc3luYyAoKSA9PiB7IGlmICh1c2VyKSB7IGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbSgncHJvZmlsZXMnKS5zZWxlY3QoJyonKS5lcSgnaWQnLCB1c2VyLmlkKS5zaW5nbGUoKTsgc2V0UHJvZmlsZShkYXRhKTsgfSB9O1xuICByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHVzZXIsIHByb2ZpbGUsIGxvYWRpbmcsIHJlZnJlc2hQcm9maWxlIH19PntjaGlsZHJlbn08L0F1dGhDb250ZXh0LlByb3ZpZGVyPjtcbn1cbmV4cG9ydCBjb25zdCB1c2VBdXRoID0gKCkgPT4gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XG4iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsInN1cGFiYXNlIiwiQXV0aENvbnRleHQiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwicHJvZmlsZSIsInNldFByb2ZpbGUiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImF1dGgiLCJnZXRTZXNzaW9uIiwidGhlbiIsImRhdGEiLCJzZXNzaW9uIiwiZmV0Y2hQcm9maWxlIiwiaWQiLCJzdWJzY3JpcHRpb24iLCJvbkF1dGhTdGF0ZUNoYW5nZSIsIl9lIiwidW5zdWJzY3JpYmUiLCJ1aWQiLCJmcm9tIiwic2VsZWN0IiwiZXEiLCJzaW5nbGUiLCJyZWZyZXNoUHJvZmlsZSIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VBdXRoIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/AuthContext.js\n");

/***/ }),

/***/ "./lib/supabase.js":
/*!*************************!*\
  !*** ./lib/supabase.js ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__]);\n_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(\"https://daelhlssmviwqdfljrfw.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZWxobHNzbXZpd3FkZmxqcmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDU4NzAsImV4cCI6MjA4ODY4MTg3MH0.i-g2l7qs2H8yD9dzyLA3YIpUSQFpGbRkAfKjm5z8xOQ\");\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2UuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBcUQ7QUFDOUMsTUFBTUMsV0FBV0QsbUVBQVlBLENBQ2xDRSwwQ0FBb0MsRUFDcENBLGtOQUF5QyxFQUN6QyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsZWN0Ly4vbGliL3N1cGFiYXNlLmpzPzE1OTgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMLFxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWVxuKTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/supabase.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/AuthContext */ \"./lib/AuthContext.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_AuthContext__WEBPACK_IMPORTED_MODULE_2__]);\n_lib_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/victoriaolko/Downloads/flect-web-3/pages/_app.js\",\n            lineNumber: 4,\n            columnNumber: 24\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/victoriaolko/Downloads/flect-web-3/pages/_app.js\",\n        lineNumber: 4,\n        columnNumber: 10\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBK0I7QUFDbUI7QUFDbkMsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFBTyw4REFBQ0gsMERBQVlBO2tCQUFDLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBQy9DIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlY3QvLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyIH0gZnJvbSAnLi4vbGliL0F1dGhDb250ZXh0JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgcmV0dXJuIDxBdXRoUHJvdmlkZXI+PENvbXBvbmVudCB7Li4ucGFnZVByb3BzfS8+PC9BdXRoUHJvdmlkZXI+O1xufVxuIl0sIm5hbWVzIjpbIkF1dGhQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@supabase/supabase-js");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();