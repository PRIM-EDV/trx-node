// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.1
//   protoc               v4.24.2
// source: trx.proto

/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import {
  DeleteMapEntity_Request,
  DeleteMapEntity_Response,
  GetAllMapEntities_Request,
  GetAllMapEntities_Response,
  SetMapEntity_Request,
  SetMapEntity_Response,
} from "./trx.entity";

export const protobufPackage = "";

export interface Request {
  setMapEntity?: SetMapEntity_Request | undefined;
  deleteMapEntity?: DeleteMapEntity_Request | undefined;
  getAllMapEntities?: GetAllMapEntities_Request | undefined;
}

export interface Response {
  setMapEntity?: SetMapEntity_Response | undefined;
  deleteMapEntity?: DeleteMapEntity_Response | undefined;
  getAllMapEntities?: GetAllMapEntities_Response | undefined;
}

export interface Error {
  type: string;
  message: string;
}

export interface TrxMessage {
  id: string;
  request?: Request | undefined;
  response?: Response | undefined;
  error?: Error | undefined;
}

function createBaseRequest(): Request {
  return { setMapEntity: undefined, deleteMapEntity: undefined, getAllMapEntities: undefined };
}

export const Request = {
  encode(message: Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.setMapEntity !== undefined) {
      SetMapEntity_Request.encode(message.setMapEntity, writer.uint32(10).fork()).ldelim();
    }
    if (message.deleteMapEntity !== undefined) {
      DeleteMapEntity_Request.encode(message.deleteMapEntity, writer.uint32(18).fork()).ldelim();
    }
    if (message.getAllMapEntities !== undefined) {
      GetAllMapEntities_Request.encode(message.getAllMapEntities, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.setMapEntity = SetMapEntity_Request.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.deleteMapEntity = DeleteMapEntity_Request.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.getAllMapEntities = GetAllMapEntities_Request.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Request {
    return {
      setMapEntity: isSet(object.setMapEntity) ? SetMapEntity_Request.fromJSON(object.setMapEntity) : undefined,
      deleteMapEntity: isSet(object.deleteMapEntity)
        ? DeleteMapEntity_Request.fromJSON(object.deleteMapEntity)
        : undefined,
      getAllMapEntities: isSet(object.getAllMapEntities)
        ? GetAllMapEntities_Request.fromJSON(object.getAllMapEntities)
        : undefined,
    };
  },

  toJSON(message: Request): unknown {
    const obj: any = {};
    if (message.setMapEntity !== undefined) {
      obj.setMapEntity = SetMapEntity_Request.toJSON(message.setMapEntity);
    }
    if (message.deleteMapEntity !== undefined) {
      obj.deleteMapEntity = DeleteMapEntity_Request.toJSON(message.deleteMapEntity);
    }
    if (message.getAllMapEntities !== undefined) {
      obj.getAllMapEntities = GetAllMapEntities_Request.toJSON(message.getAllMapEntities);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Request>, I>>(base?: I): Request {
    return Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Request>, I>>(object: I): Request {
    const message = createBaseRequest();
    message.setMapEntity = (object.setMapEntity !== undefined && object.setMapEntity !== null)
      ? SetMapEntity_Request.fromPartial(object.setMapEntity)
      : undefined;
    message.deleteMapEntity = (object.deleteMapEntity !== undefined && object.deleteMapEntity !== null)
      ? DeleteMapEntity_Request.fromPartial(object.deleteMapEntity)
      : undefined;
    message.getAllMapEntities = (object.getAllMapEntities !== undefined && object.getAllMapEntities !== null)
      ? GetAllMapEntities_Request.fromPartial(object.getAllMapEntities)
      : undefined;
    return message;
  },
};

function createBaseResponse(): Response {
  return { setMapEntity: undefined, deleteMapEntity: undefined, getAllMapEntities: undefined };
}

export const Response = {
  encode(message: Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.setMapEntity !== undefined) {
      SetMapEntity_Response.encode(message.setMapEntity, writer.uint32(10).fork()).ldelim();
    }
    if (message.deleteMapEntity !== undefined) {
      DeleteMapEntity_Response.encode(message.deleteMapEntity, writer.uint32(18).fork()).ldelim();
    }
    if (message.getAllMapEntities !== undefined) {
      GetAllMapEntities_Response.encode(message.getAllMapEntities, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Response {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.setMapEntity = SetMapEntity_Response.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.deleteMapEntity = DeleteMapEntity_Response.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.getAllMapEntities = GetAllMapEntities_Response.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Response {
    return {
      setMapEntity: isSet(object.setMapEntity) ? SetMapEntity_Response.fromJSON(object.setMapEntity) : undefined,
      deleteMapEntity: isSet(object.deleteMapEntity)
        ? DeleteMapEntity_Response.fromJSON(object.deleteMapEntity)
        : undefined,
      getAllMapEntities: isSet(object.getAllMapEntities)
        ? GetAllMapEntities_Response.fromJSON(object.getAllMapEntities)
        : undefined,
    };
  },

  toJSON(message: Response): unknown {
    const obj: any = {};
    if (message.setMapEntity !== undefined) {
      obj.setMapEntity = SetMapEntity_Response.toJSON(message.setMapEntity);
    }
    if (message.deleteMapEntity !== undefined) {
      obj.deleteMapEntity = DeleteMapEntity_Response.toJSON(message.deleteMapEntity);
    }
    if (message.getAllMapEntities !== undefined) {
      obj.getAllMapEntities = GetAllMapEntities_Response.toJSON(message.getAllMapEntities);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Response>, I>>(base?: I): Response {
    return Response.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Response>, I>>(object: I): Response {
    const message = createBaseResponse();
    message.setMapEntity = (object.setMapEntity !== undefined && object.setMapEntity !== null)
      ? SetMapEntity_Response.fromPartial(object.setMapEntity)
      : undefined;
    message.deleteMapEntity = (object.deleteMapEntity !== undefined && object.deleteMapEntity !== null)
      ? DeleteMapEntity_Response.fromPartial(object.deleteMapEntity)
      : undefined;
    message.getAllMapEntities = (object.getAllMapEntities !== undefined && object.getAllMapEntities !== null)
      ? GetAllMapEntities_Response.fromPartial(object.getAllMapEntities)
      : undefined;
    return message;
  },
};

function createBaseError(): Error {
  return { type: "", message: "" };
}

export const Error = {
  encode(message: Error, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Error {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseError();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Error {
    return {
      type: isSet(object.type) ? globalThis.String(object.type) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: Error): unknown {
    const obj: any = {};
    if (message.type !== "") {
      obj.type = message.type;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Error>, I>>(base?: I): Error {
    return Error.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Error>, I>>(object: I): Error {
    const message = createBaseError();
    message.type = object.type ?? "";
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseTrxMessage(): TrxMessage {
  return { id: "", request: undefined, response: undefined, error: undefined };
}

export const TrxMessage = {
  encode(message: TrxMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.request !== undefined) {
      Request.encode(message.request, writer.uint32(18).fork()).ldelim();
    }
    if (message.response !== undefined) {
      Response.encode(message.response, writer.uint32(26).fork()).ldelim();
    }
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrxMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrxMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.request = Request.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.response = Response.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.error = Error.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TrxMessage {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      request: isSet(object.request) ? Request.fromJSON(object.request) : undefined,
      response: isSet(object.response) ? Response.fromJSON(object.response) : undefined,
      error: isSet(object.error) ? Error.fromJSON(object.error) : undefined,
    };
  },

  toJSON(message: TrxMessage): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.request !== undefined) {
      obj.request = Request.toJSON(message.request);
    }
    if (message.response !== undefined) {
      obj.response = Response.toJSON(message.response);
    }
    if (message.error !== undefined) {
      obj.error = Error.toJSON(message.error);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TrxMessage>, I>>(base?: I): TrxMessage {
    return TrxMessage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TrxMessage>, I>>(object: I): TrxMessage {
    const message = createBaseTrxMessage();
    message.id = object.id ?? "";
    message.request = (object.request !== undefined && object.request !== null)
      ? Request.fromPartial(object.request)
      : undefined;
    message.response = (object.response !== undefined && object.response !== null)
      ? Response.fromPartial(object.response)
      : undefined;
    message.error = (object.error !== undefined && object.error !== null) ? Error.fromPartial(object.error) : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
