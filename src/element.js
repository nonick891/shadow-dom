import { tofNode, tofStr } from './type-check';

export const getElOr = (element, selector) =>
	tofNode(element)
		? element
		: (bodySelector(tofStr(element) ? element : selector))

const bodySelector = selector =>
	document.body.querySelector(selector);

export const safeSelect = (el, selector) =>
	el && selector && !el.isSameNode(selector) 
		? el.querySelector(selector) : el;

export const getContent = el =>
	el.contentDocument || el.contentWindow.document;

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

const setHtml  = (el, { html }) =>
	html ? el.innerHTML = html : false;

const clean = props =>
	['tagName', 'html'].map(n => delete props[n]);

const setAttrs = (props, e) =>
	Object.keys(props).map(key => e.setAttribute(key, props[key]));