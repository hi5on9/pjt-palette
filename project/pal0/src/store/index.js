import reducer from '../reducer';
import { createStore } from 'redux';

export default function initStore() {
    const store = createStore( 
        reducer,
    );
    return store;
}

