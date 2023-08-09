import React from 'react';
import {Container} from './Container';

import { Subscribe } from "@react-rxjs/core";

const MySubscribe: any = Subscribe


export const Playground = () => {
    return <MySubscribe>
        <Container />
    </MySubscribe>
}
