import { tofNode } from './type-check';

export const getElOr = (element, selector) =>
	element instanceof HTMLElement
		? element
		: bodySelector(selector)

const bodySelector = selector =>
	document.body.querySelector(selector);

export const safeSelect = (el, selector) =>
	selector ? el.querySelector(selector) : el;

export const appendElement = (obj, parent) =>
	appendChild(createElement(obj), parent);

const appendChild = (el, parent) =>
	tofNode(parent) && tofNode(el) ? parent.appendChild(el) : false;

const createElement = obj => {
	obj = handleTag(obj);
	return fillProps(document.createElement(obj.tagName), obj);
}

const handleTag = obj =>
	obj && obj.tagName ? obj : addTag(obj);

const addTag = obj =>
	Object.assign(getDivTag(), Boolean(obj) ? obj : {});

const getDivTag = () =>
	({ tagName: 'div' });

const fillProps = (e, props) => {
	setHtml(e, props);
	clean(props);
	setAttrs(props, e);
	return e;
};

const setHtml  = (el, { content }) =>
	content ? el.innerHTML = content : false;

const clean = props =>
	['tagName', 'content'].map(n => delete props[n]);

const setAttrs = (props, e) =>
	Object.keys(props).map(key => e.setAttribute(key, props[key]));