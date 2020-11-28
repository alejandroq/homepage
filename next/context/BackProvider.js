import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const initialState = {
    back: false,
    clicked: () => { },
}

export const BackContext = React.createContext(initialState);

const Stack = value => ({
    values: [value],
    pop: function () {
        return this.values.pop();
    },
    push: function (value) {
        this.values.push(value);
    },
    count: function () {
        return this.values.length;
    },
    peek: function () {
        return this.values[this.values.length - 1];
    },
    toString: function () {
        return `Stack(values: [${this.values}])`;
    },
});

// TODO address case when the back button is clicked and stack is not appropriately detracted
export default function BackProvider({ children }) {
    const router = useRouter();
    const [back, setBack] = useState(false);
    const [stack, setStack] = useState(Stack(router.asPath));

    useEffect(() => {
        if (router.asPath !== stack.peek()) {
            stack.push(router.asPath);
            setStack(stack);
        }
        setBack(stack.count() > 1);
    });

    const clicked = () => {
        router.back();
        if (stack.count() >= 1) {
            stack.pop();
            setStack(stack);
        }
    }

    return (
        <BackContext.Provider value={{
            back,
            clicked
        }}>
            {children}
        </BackContext.Provider>
    )
}

