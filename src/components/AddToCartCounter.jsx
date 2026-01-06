import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { increment } from '../redux/features/counter/counterSlice';

export default function AddToCartCounter() {
    const { count } = useSelector((state)=> state.counter);
    const dispacth = useDispatch();
  return (
    <div>
        <button onClick={()=> dispacth(increment())}>Increment</button>
        <div><h1>{count}</h1></div>
        <button onClick={()=> dispacth(decrement())}>Decrement</button>

    </div>
  )
}
