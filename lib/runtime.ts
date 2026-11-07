import { AsyncLocalStorage } from 'node:async_hooks';
const store = new AsyncLocalStorage<Record<string, unknown>>();
export function withRuntime<T>(env:unknown, fn:()=>T){return store.run(env as Record<string,unknown>,fn);}
export function setting(name:string){const value=store.getStore()?.[name];return typeof value==='string'?value:process.env[name];}
