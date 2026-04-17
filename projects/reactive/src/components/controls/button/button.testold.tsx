/* eslint-disable max-len */
// /* eslint-disable no-unused-expressions */
// /* eslint-disable no-console */
// /* eslint-disable react/jsx-props-no-spreading */
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

// function attributeTest(targetNode, expectedAttributes = []) {
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

// function mountButton(asAnchor, props = {}) {
//     const { children, ...rest } = props;

//     const hrefProp = asAnchor ? hrefPropValue : undefined;

//     return mountTo(
//         <Button asAnchor={asAnchor} href={hrefProp} {...rest}>
//             {children}
//         </Button>,
//     );
// }

// function expectRootToBe(
//     wrapper,
//     asAnchor,
//     {
//         type,
//         variant,
//         size,
//         rounded,
//         leftIcon,
//         rightIcon,
//         additionalClasses = [],
//         additionalAttributes = [],
//     } = {},
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

//     const staticAttributes = [];

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

// function expectTextToBe(rootNode, text, location = 0) {
//     const contentNode = rootNode.childNodes[location];

//     expect(contentNode.nodeName).to.equal('SPAN');
//     expect(contentNode.innerHTML).to.equal(text);
// }

// function expectIconToBe(rootNode, iconProp, sizeProp, location) {
//     const iconNode = rootNode.childNodes[location];
//     expect(iconNode.nodeName).to.equal('svg');

//     const expectedClasses = [
//         'svg-inline--fa',
//         'ra-icon',
//         `fa-${iconProp.iconName}`,
//     ];

//     expect([...iconNode.classList]).to.include.members(expectedClasses);
// }

// function rootTests(asAnchor) {
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

//     it('With children', () => {
//         const testText = 'FooBar';

//         const wrapper = mountButton(asAnchor, {
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor);

//         expectTextToBe(rootNode, testText);
//     });

//     it('With id prop', () => {
//         const testText = 'FooBar';
//         const idProp = 'faz';

//         const wrapper = mountButton(asAnchor, {
//             id: idProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalAttributes: [{ name: 'id', value: idProp }],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With className prop', () => {
//         const testText = 'FooBar';
//         const classNameProp = ['class1', 'class2'];

//         const wrapper = mountButton(asAnchor, {
//             className: join(classNameProp, ' '),
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalClasses: classNameProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With type prop', () => {
//         const testText = 'FooBar';
//         const typeProp = 'submit';

//         const wrapper = mountButton(asAnchor, {
//             type: typeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             type: typeProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With type prop set specifically null', () => {
//         const testText = 'FooBar';
//         const typeProp = null;

//         const wrapper = mountButton(asAnchor, {
//             type: typeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             type: typeProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With aria-label prop', () => {
//         const testText = 'FooBar';
//         const ariaLabelProp = 'test label';

//         const wrapper = mountButton(asAnchor, {
//             'aria-label': ariaLabelProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalAttributes: [
//                 {
//                     name: 'aria-label',
//                     value: ariaLabelProp,
//                 },
//             ],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With title prop', () => {
//         const testText = 'FooBar';
//         const titleProp = 'test title';

//         const wrapper = mountButton(asAnchor, {
//             title: titleProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalAttributes: [{ name: 'title', value: titleProp }],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With aria-describedby prop', () => {
//         const testText = 'FooBar';
//         const ariaDescribedbyProp = 'otherElementId';

//         const wrapper = mountButton(asAnchor, {
//             'aria-describedby': ariaDescribedbyProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalAttributes: [
//                 {
//                     name: 'aria-describedby',
//                     value: ariaDescribedbyProp,
//                 },
//             ],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With color prop', () => {
//         const testText = 'FooBar';
//         const colorProp = 'primary';

//         const wrapper = mountButton(asAnchor, {
//             color: colorProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalClasses: [`sch-${colorProp}`],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With variant prop', () => {
//         const testText = 'FooBar';
//         const variantProp = 'outline';

//         const wrapper = mountButton(asAnchor, {
//             variant: variantProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             variant: variantProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With variant prop set specifically null', () => {
//         const testText = 'FooBar';
//         const variantProp = null;

//         const wrapper = mountButton(asAnchor, {
//             variant: variantProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             variant: variantProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With useDark prop', () => {
//         const testText = 'FooBar';

//         const wrapper = mountButton(asAnchor, {
//             useDark: true,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalClasses: ['dark'],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With noPadding prop', () => {
//         const testText = 'FooBar';

//         const wrapper = mountButton(asAnchor, {
//             noPadding: true,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalClasses: ['no-padding'],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With size prop', () => {
//         const testText = 'FooBar';
//         const sizeProp = 'lg';

//         const wrapper = mountButton(asAnchor, {
//             size: sizeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             size: sizeProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With size prop set specifically null', () => {
//         const testText = 'FooBar';
//         const sizeProp = null;

//         const wrapper = mountButton(asAnchor, {
//             size: sizeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             size: sizeProp,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With hidden prop', () => {
//         const testText = 'FooBar';

//         const wrapper = mountButton(asAnchor, {
//             hidden: true,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalClasses: ['hidden'],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With disabled prop', () => {
//         const testText = 'FooBar';

//         const wrapper = mountButton(asAnchor, {
//             disabled: true,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalAttributes: [{ name: 'disabled', value: '' }],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With rounded prop', () => {
//         const testText = 'FooBar';

//         const wrapper = mountButton(asAnchor, {
//             rounded: true,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             rounded: true,
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With dockSide prop', () => {
//         const testText = 'FooBar';
//         const dockSideProp = 'left';

//         const wrapper = mountButton(asAnchor, {
//             dockSide: dockSideProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             additionalClasses: [`dock-${dockSideProp}`],
//         });

//         expectTextToBe(rootNode, testText);
//     });

//     it('With onClick prop', () => {
//         const testText = 'FooBar';
//         const onClickProp = sinon.spy();
//         const onClickMetaProp = 'metaTest';

//         const wrapper = mountButton(asAnchor, {
//             onClick: onClickProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor);

//         expectTextToBe(rootNode, testText);

//         wrapper.simulate('click');
//         expect(onClickProp.calledOnce).to.be.true;
//         expect(onClickProp.args[0][0].event).to.exist;
//         expect(onClickProp.args[0][0].meta).to.deep.equal(onClickMetaProp);
//     });

//     it('With leftIcon prop', () => {
//         const testText = 'FooBar';
//         const leftIconProp = faCircle;

//         const wrapper = mountButton(asAnchor, {
//             leftIcon: leftIconProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             leftIcon: true,
//         });

//         expectTextToBe(rootNode, testText, 1);

//         expectIconToBe(rootNode, leftIconProp, 'md', 0);
//     });

//     it('With leftIcon and size prop', () => {
//         const testText = 'FooBar';
//         const leftIconProp = faCircle;
//         const sizeProp = 'lg';

//         const wrapper = mountButton(asAnchor, {
//             leftIcon: leftIconProp,
//             size: sizeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             size: sizeProp,
//             leftIcon: true,
//         });

//         expectTextToBe(rootNode, testText, 1);

//         expectIconToBe(rootNode, leftIconProp, sizeProp, 0);
//     });

//     it('With rightIcon prop', () => {
//         const testText = 'FooBar';
//         const rightIconProp = faCircle;

//         const wrapper = mountButton(asAnchor, {
//             rightIcon: rightIconProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             rightIcon: true,
//         });

//         expectTextToBe(rootNode, testText);

//         expectIconToBe(rootNode, rightIconProp, 'md', 1);
//     });

//     it('With rightIcon and size prop', () => {
//         const testText = 'FooBar';
//         const rightIconProp = faCircle;
//         const sizeProp = 'lg';

//         const wrapper = mountButton(asAnchor, {
//             rightIcon: rightIconProp,
//             size: sizeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             rightIcon: true,
//             size: sizeProp,
//         });

//         expectTextToBe(rootNode, testText);

//         expectIconToBe(rootNode, rightIconProp, sizeProp, 1);
//     });

//     it('With leftIcon, rightIcon prop', () => {
//         const testText = 'FooBar';
//         const leftIconProp = faSquare;
//         const rightIconProp = faCircle;

//         const wrapper = mountButton(asAnchor, {
//             leftIcon: leftIconProp,
//             rightIcon: rightIconProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             leftIcon: true,
//             rightIcon: true,
//         });

//         expectIconToBe(rootNode, leftIconProp, 'md', 0);

//         expectIconToBe(rootNode, rightIconProp, 'md', 2);
//     });

//     it('With leftIcon, rightIcon and size prop', () => {
//         const testText = 'FooBar';
//         const leftIconProp = faSquare;
//         const rightIconProp = faCircle;
//         const sizeProp = 'lg';

//         const wrapper = mountButton(asAnchor, {
//             leftIcon: leftIconProp,
//             rightIcon: rightIconProp,
//             size: sizeProp,
//             children: testText,
//         });

//         const rootNode = expectRootToBe(wrapper, asAnchor, {
//             leftIcon: true,
//             rightIcon: true,
//             size: sizeProp,
//         });

//         expectTextToBe(rootNode, testText, 1);

//         expectIconToBe(rootNode, leftIconProp, sizeProp, 0);

//         expectIconToBe(rootNode, rightIconProp, sizeProp, 2);
//     });
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
