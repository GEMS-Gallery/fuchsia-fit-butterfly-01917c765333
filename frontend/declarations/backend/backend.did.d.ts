import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GroceryItem {
  'id' : bigint,
  'name' : string,
  'completed' : boolean,
  'emoji' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string], Result_1>,
  'getItems' : ActorMethod<[], Array<GroceryItem>>,
  'toggleItemCompletion' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
