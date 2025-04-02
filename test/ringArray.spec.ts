import { createRing } from '#🪕/ringArray';
import { describe, expect, it, vi } from 'vitest';

describe('createRing (export)', () => {
  const sourceArr = Object.freeze(['foo', 'bar', 'baz']);

  it('cycles as expected', () => {
    expect(() => createRing(sourceArr)).not.toThrow();
    expect(() => createRing(sourceArr)).toBeDefined();

    const testRingArr = createRing(sourceArr);
    const jump = vi.spyOn(testRingArr, 'jump');
    expect(testRingArr).toBeDefined();
    expect(Object.keys(testRingArr)).toEqual(expect.arrayContaining(['contents', 'index', 'add', 'insert', 'get', 'jump', 'next', 'remove', 'removeAt']));

    expect(testRingArr.contents, 'Initial ring array contents').toEqual(['foo', 'bar', 'baz']);
    expect(testRingArr.index, 'Initial ring array index').toEqual(0); // NOTE: after this initial index check, each time we view `.index` will be the index of what was just returned
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(0);

    const firstSix = Array.from({ length: 6 }, () => testRingArr.next());
    expect(firstSix, 'Initial ring array, first six values').toEqual(['foo', 'bar', 'baz', 'foo', 'bar', 'baz']);
    expect(testRingArr.index, 'Index after first six').toEqual(2);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(0);

    expect(testRingArr.get(1), 'ring.get(1)').toEqual('bar');
    expect(testRingArr.index, 'Index after .get(1)').toEqual(1);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(0);

    expect(testRingArr.jump(0).next(), 'ring.jump(0).next()').toEqual('foo');
    expect(testRingArr.index, 'Index after .jump(0).next()').toEqual(0);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(1);
    expect(jump, 'Checking .jump args').toHaveBeenLastCalledWith(0);

    expect(testRingArr.add('puz').next(), 'ring.add("puz").next()').toEqual('bar');
    expect(testRingArr.contents, 'Contents after .add("puz").next()').toEqual(['foo', 'bar', 'baz', 'puz']);
    expect(testRingArr.index, 'Index after .add("puz").next()').toEqual(1);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(1);
    expect(jump, 'Checking .jump args').toHaveBeenLastCalledWith(0);

    expect(testRingArr.get(3), 'ring.get(3)').toEqual('puz');
    expect(testRingArr.index, 'Index after .get(3)').toEqual(3);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(1);
    expect(jump, 'Checking .jump args').toHaveBeenLastCalledWith(0);

    expect(testRingArr.jump(3).remove('bar').next(), 'ring.jump(3).remove by value.next()').toEqual('puz');
    expect(testRingArr.contents, 'Contents after .jump(3).remove("bar").next()').toEqual(['foo', 'baz', 'puz']);
    expect(testRingArr.index, 'Index after .jump(3).remove("bar").next()').toEqual(2);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(3); // NOTE: once from .jump(3), once from the wrapped effect of .remove("bar")
    expect(jump, 'Checking .jump args').toHaveBeenNthCalledWith(2, 3);
    expect(jump, 'Checking .jump args').toHaveBeenNthCalledWith(3, 2);

    expect(testRingArr.jump(2).removeAt(0).next(), 'ring.jump(2).removeAt(0).next()').toEqual('puz');
    expect(testRingArr.contents, 'Contents after .jump(2).removeAt(0).next()').toEqual(['baz', 'puz']);
    expect(testRingArr.index, 'Index after .jump(2).removeAt(0).next()').toEqual(1);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(5); // NOTE: once from .jump(3), once from the effect of .removeAt(0)
    expect(jump, 'Checking .jump args').toHaveBeenNthCalledWith(4, 2);
    expect(jump, 'Checking .jump args').toHaveBeenNthCalledWith(5, 1);

    expect(testRingArr.insert('foo', 0).get(0), 'ring.insert("foo", 0).get(0)').toEqual('foo');
    expect(testRingArr.contents, 'Contents after .insert("foo", 0).get(0)').toEqual(['foo', 'baz', 'puz']);
    expect(testRingArr.index, 'Index after .insert("foo", 0).get(0)').toEqual(0);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(6); // NOTE: once from the effect of .insert("foo", 0)
    expect(jump, 'Checking .jump args').toHaveBeenLastCalledWith(2);

    const nextSix = Array.from({ length: 6 }, () => testRingArr.next());
    expect(nextSix).toEqual(['baz', 'puz', 'foo', 'baz', 'puz', 'foo']);
    expect(testRingArr.index, 'Index after next six').toEqual(0);
    expect(jump, 'Checking .jump called #').toHaveBeenCalledTimes(6);
    expect(jump, 'Checking .jump args').toHaveBeenLastCalledWith(2);
  });

  it('inserts things correctly', () => {
    const testRingArr = createRing(sourceArr);
    const jump = vi.spyOn(testRingArr, 'jump');

    expect(() => testRingArr.insert('dummy', -1)).toThrowError('Invalid index provided');
    expect(() => testRingArr.insert('dummy', 3)).toThrowError('Invalid index provided');

    testRingArr.jump(2).insert('dummy-1', 0);
    expect(jump).toHaveBeenCalledTimes(2);
    expect(jump).toHaveBeenLastCalledWith(3);
    expect(testRingArr.contents).toEqual(['dummy-1', ...sourceArr]);
    expect(testRingArr.index).toEqual(3);

    testRingArr.jump(0).insert('dummy-2', 1);
    expect(jump).toHaveBeenCalledTimes(3);
    expect(jump).toHaveBeenLastCalledWith(0);
    expect(testRingArr.contents).toEqual(['dummy-1', 'dummy-2', ...sourceArr]);
    expect(testRingArr.index).toEqual(0);

    testRingArr.jump(2).insert('dummy-3', 2);
    expect(jump).toHaveBeenCalledTimes(5);
    expect(jump).toHaveBeenLastCalledWith(3);
    expect(testRingArr.contents).toEqual(['dummy-1', 'dummy-2', 'dummy-3', ...sourceArr]);
    expect(testRingArr.index).toEqual(3);
  });

  it('removes things correctly', () => {
    const testRingArr = createRing([...sourceArr, ...sourceArr]);
    const jump = vi.spyOn(testRingArr, 'jump');

    expect(() => testRingArr.removeAt(-1)).toThrowError('Invalid index provided');
    expect(() => testRingArr.removeAt(6)).toThrowError('Invalid index provided');
    expect(() => testRingArr.remove('6')).toThrowError('Invalid value provided');
    try {
      testRingArr.remove('6');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).cause).toEqual(new Error('Invalid index provided'));
    }

    testRingArr.removeAt(5);
    expect(jump).toHaveBeenCalledTimes(0);
    expect(testRingArr.contents).toEqual([...sourceArr, 'foo', 'bar']);
    expect(testRingArr.index).toEqual(0);

    testRingArr.jump(1).removeAt(0);
    expect(jump).toHaveBeenCalledTimes(2);
    expect(jump).toHaveBeenLastCalledWith(0);
    expect(testRingArr.contents).toEqual(['bar', 'baz', 'foo', 'bar']);
    expect(testRingArr.index).toEqual(0);

    testRingArr.jump(1).removeAt(1);
    expect(jump).toHaveBeenCalledTimes(4);
    expect(jump).toHaveBeenLastCalledWith(0);
    expect(testRingArr.contents).toEqual(['bar', 'foo', 'bar']);
    expect(testRingArr.index).toEqual(0);

    testRingArr.jump(1).removeAt(2);
    expect(jump).toHaveBeenCalledTimes(5);
    expect(jump).toHaveBeenLastCalledWith(1);
    expect(testRingArr.contents).toEqual(['bar', 'foo']);
    expect(testRingArr.index).toEqual(1);

    testRingArr.jump(1).removeAt(1);
    expect(jump).toHaveBeenCalledTimes(7);
    expect(jump).toHaveBeenLastCalledWith(0);
    expect(testRingArr.contents).toEqual(['bar']);
    expect(testRingArr.index).toEqual(0);

    testRingArr.removeAt(0);
    expect(jump).toHaveBeenCalledTimes(7);
    expect(jump).toHaveBeenLastCalledWith(0);
    expect(testRingArr.contents).toEqual([]);
    expect(testRingArr.index).toEqual(0);

    testRingArr.removeAt(0);
    expect(jump).toHaveBeenCalledTimes(7);
    expect(jump).toHaveBeenLastCalledWith(0);
    expect(testRingArr.contents).toEqual([]);
    expect(testRingArr.index).toEqual(0);
  });
});
