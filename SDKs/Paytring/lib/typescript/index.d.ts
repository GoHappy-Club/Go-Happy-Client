import type { OrderInterface } from './interfaces/Order.interface';
import React from 'react';
export declare function createOrder(data: OrderInterface): Promise<Partial<{
    order_id: string;
    status: string;
    url: string;
}> | undefined>;
export default function Paytring({ success, failure, init, }: {
    success: () => void;
    failure: () => void;
    init: (args: {
        open: (value: string) => void;
    }) => void;
}): React.JSX.Element | null;
export * from './interfaces/Order.interface';
export * from './helpers/hash.helper';
//# sourceMappingURL=index.d.ts.map