// Type definitions for hapi-decorators v0.4.3
// Project: https://github.com/knownasilya/hapi-decorators
// Definitions by: Ken Howard <https://github.com/kenhowardpdx>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4
import * as hapi from 'hapi';


interface ControllerStatic {
    new(...args: any[]): Controller;
}
export interface Controller {
    baseUrl: string;
    routes: () => hapi.ServerRoute[];
}
export function controller(baseUrl: string): (target: ControllerStatic) => void;
interface IRouteSetup {
    (target: any, key: any, descriptor: any): any;
}
interface IRouteDecorator {
    (method: string, path: string): IRouteSetup;
}
interface IRouteConfig {
    (path: string): IRouteSetup;
}
export const route: IRouteDecorator;
export const get: IRouteConfig;
export const post: IRouteConfig;
export const put: IRouteConfig;
// export const delete: IRouteConfig;
export const patch: IRouteConfig;
export const all: IRouteConfig;
export function options(options: hapi.RouteOptions | ((server: hapi.Server) => hapi.RouteOptions)): (target: any, key: any, descriptor: any) => any;
export function validate(config: hapi.RouteOptionsValidate): (target: any, key: any, descriptor: any) => any;
export function cache(cacheConfig: false | hapi.RouteOptionsCache): (target: any, key: any, descriptor: any) => any;
export function pre(pre: hapi.RouteOptionsPreArray): (target: any, key: any, descriptor: any) => any;
