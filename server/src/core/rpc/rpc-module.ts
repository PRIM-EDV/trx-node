import { MetadataScanner, NestContainer } from "@nestjs/core";
import { RpcContextCreator } from "./rpc-context-creator";
import { InjectionToken } from "@nestjs/common";
import { Injectable } from "@nestjs/common/interfaces";
import { iterate } from 'iterare';
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { RPC_HANDLER_GATEWAY_METADATA, RPC_HANDLER_METADATA, RPC_METADATA } from "./constants";
import { Ws } from "src/common/interfaces/ws";

export class RpcModule {
    private container: NestContainer;
    private readonly metadataScanner = new MetadataScanner();
    private contextCreator: RpcContextCreator;

    register(
        container: NestContainer,
    ) {
        this.container = container;
        this.contextCreator = new RpcContextCreator(container);
        
        const modules = container.getModules();
        modules.forEach(({ providers }, moduleName: string) =>
            this.connectAllHandlers(providers, moduleName),
        );
    }

    public connectAllHandlers(
        providers: Map<InjectionToken, InstanceWrapper<Injectable>>,
        moduleName: string,
    ) {
        iterate(providers.values())
            .filter(wrapper => wrapper && !wrapper.isNotMetatype)
            .forEach(wrapper => this.connectHandler(wrapper, moduleName));
    }

    public connectHandler(wrapper: InstanceWrapper<Injectable>, moduleName: string) {
        const { instance, metatype } = wrapper;
        const metadataKeys = Reflect.getMetadataKeys(metatype);
        const gateway = this.getInstanceByMetatype(Reflect.getMetadata(RPC_HANDLER_GATEWAY_METADATA, metatype)) as any;
        if (!metadataKeys.includes(RPC_HANDLER_METADATA) || !this.isRpcGateway(gateway) ) {
            return;
        }

        const rpcMethods = this.metadataScanner.getAllMethodNames(instance as Object)
            .filter((methodName) => {
                return Reflect.getMetadata(RPC_METADATA, instance[methodName]) !== undefined;
            })
            .map((methodName) => {
                return this.contextCreator.create(instance as object, instance[methodName], moduleName, methodName);
            });

        gateway.onRequest.subscribe((event: { client: Ws, msgId: string, request: Request }) => {
            for (const rpcMethod of rpcMethods) {
                if (event.request[rpcMethod.name] !== undefined) {
                    rpcMethod.call(instance, event.client, event.request[rpcMethod.name]).then((value) => {
                        const response = { [rpcMethod.name]: value }
                        gateway.respond(event.client.id, event.msgId, response);
                    }
                    ).catch((err) => {
                        gateway.error(event.client.id, event.msgId, err);
                        console.error(err);
                    });
                }
            }
        });
    }

    private isRpcGateway(instance: any): boolean {
        if (!instance) { 
            return false;
        }

        return instance.hasOwnProperty('onRequest');
    }

    private getInstanceByMetatype(metatype) {
        const modules = this.container.getModules();

        for (const { providers } of modules.values()) {
            const instances = Array.from(providers.values())
                .filter(wrapper => wrapper && !wrapper.isNotMetatype && wrapper.metatype === metatype);

            if (instances.length > 0) {
                return instances[0].instance;
            }
        }
    }
}