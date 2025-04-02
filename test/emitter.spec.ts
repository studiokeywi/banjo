// @vitest-environment happy-dom
import { createEmitter } from '#🪕/emitter';
import { describe, expect, it, vi } from 'vitest';

const foo = vi.fn((event: Event) => void event);
const bar = vi.fn((event: MouseEvent) => void event);
const baz = vi.fn((event: CustomEvent<number>) => void event);

describe('createEmitter (export)', () => {
  it('API (emit/off/on/once/set)', () => {
    const emitter = createEmitter<{ foo: Event; bar: MouseEvent; baz: CustomEvent<number> }>();
    const Foo = new Event('foo');
    emitter.emit(Foo);
    expect(foo).not.toBeCalled();
    expect(bar).not.toBeCalled();
    expect(baz).not.toBeCalled();
    emitter.once('foo', foo);
    emitter.emit(Foo);
    expect(foo).toBeCalledTimes(1);
    expect(foo).nthCalledWith(1, Foo);
    expect(bar).not.toBeCalled();
    expect(baz).not.toBeCalled();
    emitter.emit(Foo);
    expect(foo).toBeCalledTimes(1);
    expect(bar).not.toBeCalled();
    expect(baz).not.toBeCalled();
    emitter.set({ bar, baz });

    const Bar = new MouseEvent('bar');
    emitter.emit(Bar);
    expect(bar).toBeCalledTimes(1);
    expect(bar).nthCalledWith(1, Bar);
    expect(baz).not.toBeCalled();
    emitter.off('bar', bar);
    emitter.emit(Bar);
    expect(bar).toBeCalledTimes(1);
    expect(bar).nthCalledWith(1, Bar);
    expect(baz).not.toBeCalled();

    const Baz = new CustomEvent('baz', { detail: 1123 });
    emitter.emit(Baz);
    expect(baz).toBeCalledTimes(1);
    expect(baz).nthCalledWith(1, Baz);
  });
});
