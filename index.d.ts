// Type definitions for hapi-decorators v0.4.3
// Project: https://github.com/knownasilya/hapi-decorators
// Definitions by: Ken Howard <https://github.com/kenhowardpdx>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4
import * as hapi from 'hapi';

OPTIONS_KEY: 'options' | 'config';
interface ControllerStatic {
    new(...args: any[]): Controller;
}
export interface Controller {
    baseUrl: string;
    optionsKey: string;
    routes: () => hapi.ServerRoute[];
}
export function controller(baseUrl: string): (target: ControllerStatic) => void;
interface IRouteSetup {
    (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;
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
export const del: IRouteConfig;
export const patch: IRouteConfig;
export const all: IRouteConfig;
export function options(options: hapi.RouteOptions | ((server: hapi.Server) => hapi.RouteOptions)): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function config(config: hapi.RouteAdditionalConfigurationOptions | ((server: hapi.Server) => hapi.RouteAdditionalConfigurationOptions)): (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function validate(config: hapi.RouteOptionsValidate): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function cache(cacheConfig: false | hapi.RouteOptionsCache): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export function pre(pre: hapi.RouteOptionsPreArray): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
