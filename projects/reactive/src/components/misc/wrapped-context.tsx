// /* eslint-disable arrow-body-style */
// /* eslint-disable react/jsx-props-no-spreading */
// import React, {
//     Context,
//     Component,
//     ComponentType,
//     ForwardedRef,
//     PropsWithChildren,
//     ComponentProps,
//     ComponentPropsWithRef,
// } from 'react';
// import isNil from 'lodash/isNil';

// export default function buildWrappedContext<
//     TContext,
//     TProps extends PropsWithChildren,
//     CType extends ComponentType<TProps>,
// >(
//     context: Context<TContext>,
//     InnerComponent: CType,
//     contextName: string,
// ) {
//     const propName = !isNil(contextName) && contextName.length > 0 ? contextName : 'context';

//     const { Consumer } = context;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const wrapped = React.forwardRef<CType, TProps>((
//         props: TProps,
//         ref: ForwardedRef<CType>,
//     ) => (
//         <Consumer>
//             {(contextValue) => {
//                 const contextProp = {
//                     [propName]: contextValue,
//                 };

//                 return (
//                     <InnerComponent
//                         {...props}
//                         {...contextProp}
//                         ref={ref}
//                     />
//                 );
//             }}
//         </Consumer>
//     ));

//     wrapped.displayName = InnerComponent.name;

//     // eslint-disable-next-line no-param-reassign
//     InnerComponent.displayName = `Wrapped${InnerComponent.name}`;

//     return wrapped;
// }
