import { createRenderer } from './responsiveSystem.js'

function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false
  return key in el
}

const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },

  setElementText(el, text) {
    el.textContent = text
  },

  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },

  createText(text) {
    return document.createTextNode(text)
  },

  setText(el, text) {
    el.nodeValue = text
  },

  patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {})
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            if (e.timeStamp < invoker.attached) return
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          invoker.value = nextValue
          invoker.attached = performance.now()
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === 'class') {
      el.className = nextValue || ''
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  },

  unmount(vnode) {
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
      return
    }

    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  }
})


const oldVnode = {
  type: 'div',
  children: [
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 },
    { type: 'p', children: 'hello', key: 3 }
  ]
}

const newVnode = {
  type: 'div',
  children: [
    { type: 'p', children: 'world', key: 3 },
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 }
  ]
}
renderer.render(oldVnode, document.querySelector('#app'))

setTimeout(() => {
  renderer.render(newVnode, document.querySelector('#app'))
}, 2000);
