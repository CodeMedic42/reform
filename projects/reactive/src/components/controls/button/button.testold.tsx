// import React from 'react';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import join from 'lodash/join';
// import isNil from 'lodash/isNil';
// import forEach from 'lodash/forEach';
// // import { faCircle } from '@audacious/icons/solid/faCircle';
// // import { faSquare } from '@audacious/icons/solid/faSquare';
// import mountTo from '../../test/enzyme';
// import Button from '.';

// const hrefPropValue = '#nowhere';

// const staticClasses = ['ra-btn', 'sch-control', 'no-select', 'ra-scheme'];

// function attributeTest(targetNode: HTMLElement, expectedAttributes: Array<{name: string; value: string}> = []) {
//     const attributesLength = expectedAttributes.length + 1; // Start at one because className probably exists.

//     forEach(expectedAttributes, (attribute) => {
//         const { name, value } = attribute;

//         expect(targetNode.getAttribute(name)).to.equal(value);
//     });

//     expect(targetNode.attributes.length).to.equal(
//         attributesLength,
//         'Attributes length incorrect',
//     );
// }

// function mountButton(asAnchor: boolean, props: Record<string, unknown> = {}) {
//     const { children, ...rest } = props;

//     const hrefProp = asAnchor ? hrefPropValue : undefined;

//     return mountTo(
//         <Button asAnchor={asAnchor} href={hrefProp} {...rest}>
//             {children}
//         </Button>,
//     );
// }

// function expectRootToBe(
//     wrapper: unknown,
//     asAnchor: boolean,
//     {
//         type,
//         variant,
//         size,
//         rounded,
//         leftIcon,
//         rightIcon,
//         additionalClasses = [],
//         additionalAttributes = [],
//     }: Record<string, unknown> = {},
// ) {
//     const rootNode = wrapper.getDOMNode();

//     const rootNodeName = asAnchor ? 'A' : 'BUTTON';

//     const sizeProp = !isNil(size) ? size : 'md';
//     const variantProp = !isNil(variant) ? variant : 'fill';
//     const typeProp = !isNil(type) ? type : 'button';

//     let childCount = 1;
//     childCount = leftIcon ? childCount + 1 : childCount;
//     childCount = rightIcon ? childCount + 1 : childCount;

//     expect(rootNode.nodeName).to.equal(rootNodeName);
//     expect([...rootNode.classList]).to.have.members([
//         ...staticClasses,
//         `size-${sizeProp}`,
//         `sch-${variantProp}`,
//         rounded ? 'border-radius-lg' : 'border-radius-sm',
//         ...additionalClasses,
//     ]);
//     expect(rootNode.childNodes.length).to.equal(
//         childCount,
//         'Expected only one child',
//     );

//     const staticAttributes: Array<{name: string; value: string}> = [];

//     if (asAnchor) {
//         staticAttributes.push({
//             name: 'href',
//             value: hrefPropValue,
//         });
//     } else {
//         staticAttributes.push({
//             name: 'type',
//             value: typeProp,
//         });
//     }

//     attributeTest(rootNode, additionalAttributes.concat(staticAttributes));

//     return rootNode;
// }

// function expectTextToBe(rootNode: HTMLElement, text: string, location = 0) {
//     const contentNode = rootNode.childNodes[location];

//     expect(contentNode.nodeName).to.equal('SPAN');
//     expect(contentNode.innerHTML).to.equal(text);
// }

// function expectIconToBe(rootNode: HTMLElement, iconProp: unknown, sizeProp: string, location: number) {
//     const iconNode = rootNode.childNodes[location];
//     expect(iconNode.nodeName).to.equal('svg');

//     const expectedClasses = [
//         'svg-inline--fa',
//         'ra-icon',
//         `fa-${iconProp.iconName}`,
//     ];

//     expect([...iconNode.classList]).to.include.members(expectedClasses);
// }

// function rootTests(asAnchor?: boolean) {
//     it('No props', () => {
//         const wrapper = mountButton(asAnchor);

//         const rootNode = expectRootToBe(wrapper, asAnchor);

//         expectTextToBe(rootNode, '');

//         const contentNode = rootNode.childNodes[0];

//         expect(contentNode.nodeName).to.equal('SPAN');
//         expect(contentNode.innerHTML).to.equal('');

//         const instance = wrapper.instance();

//         expect(instance.getRootNode()).to.equal(rootNode);

//         instance.focus();

//         expect(rootNode).to.equal(document.activeElement);

//         // Click to make sure nothing breaks if no onClick is provided.
//         wrapper.simulate('click');
//     });

//     ... (rest of tests remain commented out)
// }

// describe('Components', () => {
//     let warnStub = null;

//     before(() => {
//         warnStub = sinon.stub(console, 'warn');
//     });

//     beforeEach(() => {
//         warnStub.reset();
//     });

//     after(() => {
//         warnStub.restore();
//     });

//     describe('Button', () => {
//         it('Focus before mount', () => {
//             const button = new Button();

//             button.focus();

//             expect(console.warn.calledOnce).to.be.true;
//             expect(
//                 console.warn.calledWith(
//                     'Attempting to focus on an unmounted component',
//                 ),
//             ).to.be.true;
//         });

//         rootTests();

//         describe('With asAnchor prop', () => {
//             rootTests(true);

//             it('With target prop', () => {
//                 const testText = 'FooBar';
//                 const targetProp = '_blank';

//                 const wrapper = mountButton(true, {
//                     target: targetProp,
//                     children: testText,
//                 });

//                 const rootNode = expectRootToBe(wrapper, true, {
//                     additionalAttributes: [
//                         {
//                             name: 'target',
//                             value: targetProp,
//                         },
//                     ],
//                 });

//                 expectTextToBe(rootNode, testText);
//             });
//         });
//     });
// });
