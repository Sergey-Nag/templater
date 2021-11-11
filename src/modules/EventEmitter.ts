import { EventsStore } from "../types/templater/EventEmitter.type";

export class EventEmitter {
    private events: EventsStore = {};
    
    private static instance: EventEmitter;
    public static getInstance(): EventEmitter {
        if (EventEmitter.instance) return EventEmitter.instance;

        return EventEmitter.instance = new EventEmitter();
    }
    private constructor() {}

    on(eventName: string, callback: Function) {
        if (this.hasEvent(eventName)) {
            this.events[eventName].push(callback);
        } else {
            this.events[eventName] = [callback];
        }

        return this.unsubscribe.bind(this, eventName, callback);
    }

    emit(eventName: string, ...args: any) {
        if (!this.hasEvent(eventName)) return;

        for (let eventCallback of this.events[eventName]) {
            eventCallback(...args);
        }
    }

    remove(eventName: string) {
        if (this.hasEvent(eventName)) {
           delete this.events[eventName];
        }
    }

    unsubscribe(eventName: string, callback: Function) {
        const callbackIndex = this.events[eventName].findIndex((eventCallback: Function) => eventCallback === callback);
        
        if (callbackIndex !== -1) {
            this.events[eventName].splice(callbackIndex, 1);
        }

        if (this.events[eventName].length === 0) this.remove(eventName);
    }

    private hasEvent(eventName: string) {
        return !!this.events[eventName];
    }
}