import { tofAppend, tofNode, tofStr } from './type-check';

export const getElOr = (element, selector) =>
	tofNode(element)
		? element
		: (bodySelector(tofStr(element) ? element : selector))

const bodySelector = selector =>
	document.body.querySelector(selector);

export const safeSelect = (el, selector) =>
	el && selector && !el.isSameNode(selector) 
		? el.querySelector(selector) : el;

/**
 *
 * @param {HTMLIFrameElement} iframe
 * @returns {Document}
 */
export const getContent = iframe =>
	iframe.contentDocument || iframe.contentWindow.document;

export const appendElement = (obj, parent) =>
	appendChild(createElement(handleTag(obj)), parent);

const appendChild = (el, parent) =>
	tofAppend(parent) && tofNode(el) ? parent.appendChild(el) : false;

const createElement = obj =>
	fillProps(createChild(obj), obj);

const createChild = obj => {
	let parent = create(obj.tagName);
	if (obj.child) obj.child.map(child => appendElement(child, parent));
	return parent;
};

const create = tagName =>
	document.createElement(tagName)

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

const setHtml = (el, { html }) =>
	html ? el.innerHTML = html : false;

const clean = props =>
	['tagName', 'html', 'child'].map(n => delete props[n]);

const setAttrs = (props, e) =>
	Object.keys(props).map(key => e.setAttribute(key, props[key]));

export const removeEl = el =>
	tofNode(el) && el.remove();

export const removeEls = els =>
	Array.isArray(els) && els.map(removeEl);

export const removeChildren = root =>
	root.hasChildNodes() && removeEls(root.childNodes);

export const matches = (selector) =>
	(node) => node.matches(selector) || node.querySelector(selector);

export const find = (array, selector) => {
	let el = array.find(matches(selector)),
		child = querySelector(el, selector);
	return child ? child : el;
};

export const querySelector = (el, selector) =>
	el && el instanceof HTMLElement ? el.querySelector(selector) : false

export const findAll = (array, selector) => {
	let filtered = array.filter(matches(selector));
	return filtered.map(el => {
		let child = querySelector(el, selector);
		return child ? child : el;
	});
};