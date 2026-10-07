/* eslint-disable prettier/prettier */
// export const AllowAnonymous = () => {
//     return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
//         console.log(`The allow anonymous decorator is called: `+ propertyKey);



//     }
// }

import { SetMetadata } from "@nestjs/common"

export const AllowAnonymous = () => {
    return SetMetadata('isPublic', true);
}