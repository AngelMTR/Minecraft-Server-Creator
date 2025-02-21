import { h } from 'preact';
import { useStore } from '@nanostores/preact';
import { count } from '../stores/counter';

const Counter = () => {
    const $count = useStore(count);

    return (
        <div>
            <p className="text-xl font-bold">Count: {$count}</p>
            <button className="bg-blue-500 text-white px-4 py-2" onClick={() => count.set($count + 1)}>
                +
            </button>
            <button className="bg-red-500 text-white px-4 py-2 ml-2" onClick={() => count.set($count - 1)}>
                -
            </button>
        </div>
    );
};

export default Counter;
