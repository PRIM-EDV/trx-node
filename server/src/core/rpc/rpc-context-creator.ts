import { ContextType } from "@nestjs/common";
import { Controller } from "@nestjs/common/interfaces";
import { GuardsConsumer, GuardsContextCreator } from "@nestjs/core/guards";
import { WsContextCreator } from "@nestjs/websockets/context/ws-context-creator";
import { NestContainer } from "@nestjs/core";
import { WsProxy } from "@nestjs/websockets/context/ws-proxy";
import { ExceptionFiltersContext } from "@nestjs/websockets/context/exception-filters-context";
import { PipesConsumer, PipesContextCreator } from "@nestjs/core/pipes";
import { InterceptorsConsumer, InterceptorsContextCreator } from "@nestjs/core/interceptors";
import { ParamsMetadata } from "@nestjs/core/helpers/interfaces";
export class RpcContextCreator extends WsContextCreator {

    constructor(
        private readonly container: NestContainer
    ) {
        super(new WsProxy(),
            new ExceptionFiltersContext(container),
            new PipesContextCreator(container),
            new PipesConsumer(),
            new GuardsContextCreator(container),
            new GuardsConsumer(),
            new InterceptorsContextCreator(container),
            new InterceptorsConsumer());
    }


    public create<T extends ParamsMetadata = ParamsMetadata>(
        instance: Controller,
        callback: (...args: unknown[]) => void,
        moduleKey: string,
        methodName: string,
    ): (...args: any[]) => Promise<void> {
        const contextType: ContextType = 'ws';
        const { argsLength, paramtypes, getParamsMetadata } = this.getMetadata<T>(
            instance,
            methodName,
            contextType,
        );

        const pipes = (<any>this).pipesContextCreator.create(
            instance,
            callback,
            moduleKey,
        );

        const guards = (<any>this).guardsContextCreator.create(
            instance,
            callback,
            moduleKey,
        );

        const interceptors = (<any>this).interceptorsContextCreator.create(
            instance,
            callback,
            moduleKey,
        );

        const fnCanActivate = this.createGuardsFn(
            guards,
            instance,
            callback,
            contextType,
        );

        const paramsMetadata = getParamsMetadata(moduleKey);
        const paramsOptions = paramsMetadata
          ? (<any>this).contextUtils.mergeParamsMetatypes(paramsMetadata, paramtypes)
          : [];
        const fnApplyPipes = this.createPipesFn(pipes, paramsOptions);

        const handler = (initialArgs: unknown[], args: unknown[]) => async () => {
            if (fnApplyPipes) {
                await fnApplyPipes(initialArgs, ...args);
                return callback.apply(instance, initialArgs);
            }
            return callback.apply(instance, args);
        };
       
        const fn = async (...args: unknown[]) => {
            const initialArgs = (<any>this).contextUtils.createNullArray(argsLength);
            fnCanActivate && (await fnCanActivate(args));
            

            return (<any>this).interceptorsConsumer.intercept(
                interceptors,
                args,
                instance,
                callback,
                handler(initialArgs, args),
                contextType,
            );
        };

        Object.defineProperty(fn, 'name', { value: methodName });
        return fn;
    }
}