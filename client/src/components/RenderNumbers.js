import React from 'react';

export default function RenderNumbers() {
    let i =1
    let array = []
    while(i<101) {
        array.push(i)
        i++
    }
    return array.map(element => {
        return <option value={element}>{element}</option>
    })
}