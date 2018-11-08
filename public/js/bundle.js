(function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
	  for (var k in src) tar[k] = src[k];

	  return tar;
	}

	function isPromise(value) {
	  return value && typeof value.then === 'function';
	}

	function exclude(src, prop) {
	  const tar = {};

	  for (const k in src) k === prop || (tar[k] = src[k]);

	  return tar;
	}

	function append(target, node) {
	  target.appendChild(node);
	}

	function insert(target, node, anchor) {
	  target.insertBefore(node, anchor);
	}

	function detachNode(node) {
	  node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
	  for (var i = 0; i < iterations.length; i += 1) {
	    if (iterations[i]) iterations[i].d(detach);
	  }
	}

	function createElement(name) {
	  return document.createElement(name);
	}

	function createText(data) {
	  return document.createTextNode(data);
	}

	function setData(text, data) {
	  text.data = '' + data;
	}

	function handlePromise(promise, info) {
	  var token = info.token = {};

	  function update(type, index, key, value) {
	    if (info.token !== token) return;
	    info.resolved = key && {
	      [key]: value
	    };
	    const child_ctx = assign(assign({}, info.ctx), info.resolved);
	    const block = type && (info.current = type)(info.component, child_ctx);

	    if (info.block) {
	      if (info.blocks) {
	        info.blocks.forEach((block, i) => {
	          if (i !== index && block) {
	            block.o(() => {
	              block.d(1);
	              info.blocks[i] = null;
	            });
	          }
	        });
	      } else {
	        info.block.d(1);
	      }

	      block.c();
	      block[block.i ? 'i' : 'm'](info.mount(), info.anchor);
	      info.component.root.set({}); // flush any handlers that were created
	    }

	    info.block = block;
	    if (info.blocks) info.blocks[index] = block;
	  }

	  if (isPromise(promise)) {
	    promise.then(value => {
	      update(info.then, 1, info.value, value);
	    }, error => {
	      update(info.catch, 2, info.error, error);
	    }); // if we previously had a then/catch block, destroy it

	    if (info.current !== info.pending) {
	      update(info.pending, 0);
	      return true;
	    }
	  } else {
	    if (info.current !== info.then) {
	      update(info.then, 1, info.value, promise);
	      return true;
	    }

	    info.resolved = {
	      [info.value]: promise
	    };
	  }
	}

	function blankObject() {
	  return Object.create(null);
	}

	function destroy(detach) {
	  this.destroy = noop;
	  this.fire('destroy');
	  this.set = noop;

	  this._fragment.d(detach !== false);

	  this._fragment = null;
	  this._state = {};
	}

	function _differs(a, b) {
	  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
	}

	function _differsImmutable(a, b) {
	  return a != a ? b == b : a !== b;
	}

	function fire(eventName, data) {
	  var handlers = eventName in this._handlers && this._handlers[eventName].slice();

	  if (!handlers) return;

	  for (var i = 0; i < handlers.length; i += 1) {
	    var handler = handlers[i];

	    if (!handler.__calling) {
	      try {
	        handler.__calling = true;
	        handler.call(this, data);
	      } finally {
	        handler.__calling = false;
	      }
	    }
	  }
	}

	function flush(component) {
	  component._lock = true;
	  callAll(component._beforecreate);
	  callAll(component._oncreate);
	  callAll(component._aftercreate);
	  component._lock = false;
	}

	function get() {
	  return this._state;
	}

	function init(component, options) {
	  component._handlers = blankObject();
	  component._slots = blankObject();
	  component._bind = options._bind;
	  component._staged = {};
	  component.options = options;
	  component.root = options.root || component;
	  component.store = options.store || component.root.store;

	  if (!options.root) {
	    component._beforecreate = [];
	    component._oncreate = [];
	    component._aftercreate = [];
	  }
	}

	function on(eventName, handler) {
	  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	  handlers.push(handler);
	  return {
	    cancel: function () {
	      var index = handlers.indexOf(handler);
	      if (~index) handlers.splice(index, 1);
	    }
	  };
	}

	function set(newState) {
	  this._set(assign({}, newState));

	  if (this.root._lock) return;
	  flush(this.root);
	}

	function _set(newState) {
	  var oldState = this._state,
	      changed = {},
	      dirty = false;
	  newState = assign(this._staged, newState);
	  this._staged = {};

	  for (var key in newState) {
	    if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	  }

	  if (!dirty) return;
	  this._state = assign(assign({}, oldState), newState);

	  this._recompute(changed, this._state);

	  if (this._bind) this._bind(changed, this._state);

	  if (this._fragment) {
	    this.fire("state", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });

	    this._fragment.p(changed, this._state);

	    this.fire("update", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });
	  }
	}

	function _stage(newState) {
	  assign(this._staged, newState);
	}

	function callAll(fns) {
	  while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
	  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var proto = {
	  destroy,
	  get,
	  fire,
	  on,
	  set,
	  _recompute: noop,
	  _set,
	  _stage,
	  _mount,
	  _differs
	};

	/* src/components/Dashboard.html generated by Svelte v2.15.1 */

	function userData(data) {
	  return fetch(data.userDataUrl)
	    .then(res => res.json())
	    .then(data => data);
	}

	function documentsData(data) {
	  return fetch(data.documentsDataUrl)
	    .then(res => res.json())
	    .then(data => data);
	}

	function data() {
	  return {
	    userDataUrl: "/userData?user=simon",
	    documentsDataUrl: "/dashboardData?user=simon"
	  }
	}
	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-1efp7mf-style';
		style.textContent = ".username.svelte-1efp7mf{margin-top:2rem;margin-bottom:2rem}.add.svelte-1efp7mf{margin:2rem 0}.panel-collection.svelte-1efp7mf{display:grid;grid-gap:30px;grid-template-columns:repeat(4, 1fr)}.panel.svelte-1efp7mf{padding:2rem;border:1px solid #66b5c5}.title.svelte-1efp7mf{text-align:center;padding-top:2rem;padding-bottom:2rem}.title.svelte-1efp7mf a.svelte-1efp7mf{color:#666}";
		append(document.head, style);
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.object = list[i][0];
		child_ctx.document = list[i][1];
		return child_ctx;
	}

	function create_main_fragment(component, ctx) {
		var div2, div0, promise, text0, h3, text2, div1, promise_1;

		let info = {
			component,
			ctx,
			current: null,
			pending: create_pending_block_1,
			then: create_then_block_1,
			catch: create_catch_block_1,
			value: 'userData',
			error: 'theError'
		};

		handlePromise(promise = ctx.userData, info);

		let info_1 = {
			component,
			ctx,
			current: null,
			pending: create_pending_block,
			then: create_then_block,
			catch: create_catch_block,
			value: 'documentsData',
			error: 'theError'
		};

		handlePromise(promise_1 = ctx.documentsData, info_1);

		return {
			c() {
				div2 = createElement("div");
				div0 = createElement("div");

				info.block.c();

				text0 = createText("\n\n  ");
				h3 = createElement("h3");
				h3.textContent = "Stories";
				text2 = createText("\n\n  ");
				div1 = createElement("div");

				info_1.block.c();
				div0.className = "user-info";
				div1.className = "story-data";
				div2.className = "page";
			},

			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);

				info.block.m(div0, info.anchor = null);
				info.mount = () => div0;

				append(div2, text0);
				append(div2, h3);
				append(div2, text2);
				append(div2, div1);

				info_1.block.m(div1, info_1.anchor = null);
				info_1.mount = () => div1;
			},

			p(changed, _ctx) {
				ctx = _ctx;
				info.ctx = ctx;

				if (('userData' in changed) && promise !== (promise = ctx.userData) && handlePromise(promise, info)) ; else {
					info.block.p(changed, assign(assign({}, ctx), info.resolved));
				}

				info_1.ctx = ctx;

				if (('documentsData' in changed) && promise_1 !== (promise_1 = ctx.documentsData) && handlePromise(promise_1, info_1)) ; else {
					info_1.block.p(changed, assign(assign({}, ctx), info_1.resolved));
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div2);
				}

				info.block.d();
				info = null;

				info_1.block.d();
				info_1 = null;
			}
		};
	}

	// (14:6) {:catch theError}
	function create_catch_block_1(component, ctx) {
		var p, text0, text1_value = ctx.theError.message, text1;

		return {
			c() {
				p = createElement("p");
				text0 = createText("whoops! ");
				text1 = createText(text1_value);
			},

			m(target, anchor) {
				insert(target, p, anchor);
				append(p, text0);
				append(p, text1);
			},

			p(changed, ctx) {
				if ((changed.userData) && text1_value !== (text1_value = ctx.theError.message)) {
					setData(text1, text1_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	// (6:6) {:then userData}
	function create_then_block_1(component, ctx) {
		var div0, text0, text1_value = ctx.userData.username, text1, text2, div1;

		return {
			c() {
				div0 = createElement("div");
				text0 = createText("Username: ");
				text1 = createText(text1_value);
				text2 = createText("\n        ");
				div1 = createElement("div");
				div1.innerHTML = `<form action="/addStory?user=simon" method="POST"><input type="text" name="title">
			            <button type="submit">Add Story</button></form>`;
				div0.className = "username svelte-1efp7mf";
				div1.className = "add svelte-1efp7mf";
			},

			m(target, anchor) {
				insert(target, div0, anchor);
				append(div0, text0);
				append(div0, text1);
				insert(target, text2, anchor);
				insert(target, div1, anchor);
			},

			p(changed, ctx) {
				if ((changed.userData) && text1_value !== (text1_value = ctx.userData.username)) {
					setData(text1, text1_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div0);
					detachNode(text2);
					detachNode(div1);
				}
			}
		};
	}

	// (4:21)        <div>Loading...</div>       {:then userData}
	function create_pending_block_1(component, ctx) {
		var div;

		return {
			c() {
				div = createElement("div");
				div.textContent = "Loading...";
			},

			m(target, anchor) {
				insert(target, div, anchor);
			},

			p: noop,

			d(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (33:6) {:catch theError}
	function create_catch_block(component, ctx) {
		var p, text0, text1_value = ctx.theError.message, text1;

		return {
			c() {
				p = createElement("p");
				text0 = createText("whoops! ");
				text1 = createText(text1_value);
			},

			m(target, anchor) {
				insert(target, p, anchor);
				append(p, text0);
				append(p, text1);
			},

			p(changed, ctx) {
				if ((changed.documentsData) && text1_value !== (text1_value = ctx.theError.message)) {
					setData(text1, text1_value);
				}
			},

			d(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	// (24:6) {:then documentsData}
	function create_then_block(component, ctx) {
		var div;

		var each_value = ctx.Object.entries(ctx.documentsData);

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		return {
			c() {
				div = createElement("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}
				div.className = "panel-collection svelte-1efp7mf";
			},

			m(target, anchor) {
				insert(target, div, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}
			},

			p(changed, ctx) {
				if (changed.Object || changed.documentsData) {
					each_value = ctx.Object.entries(ctx.documentsData);

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				destroyEach(each_blocks, detach);
			}
		};
	}

	// (26:10) {#each Object.entries(documentsData) as [object, document]}
	function create_each_block(component, ctx) {
		var div2, div0, a0, img, img_src_value, a0_href_value, text0, div1, a1, text1_value = ctx.document.title, text1, a1_href_value, text2;

		return {
			c() {
				div2 = createElement("div");
				div0 = createElement("div");
				a0 = createElement("a");
				img = createElement("img");
				text0 = createText("\n              ");
				div1 = createElement("div");
				a1 = createElement("a");
				text1 = createText(text1_value);
				text2 = createText("\n            ");
				img.src = img_src_value = "images/covers/Cover-" + ctx.document.title.replace(/ /g, '-') + ".jpg";
				img.alt = "";
				a0.href = a0_href_value = "/story?id=" + ctx.document.id;
				div0.className = "cover";
				a1.href = a1_href_value = "/story?id=" + ctx.document.id;
				a1.className = "svelte-1efp7mf";
				div1.className = "title svelte-1efp7mf";
				div2.className = "panel svelte-1efp7mf";
			},

			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div0, a0);
				append(a0, img);
				append(div2, text0);
				append(div2, div1);
				append(div1, a1);
				append(a1, text1);
				append(div2, text2);
			},

			p(changed, ctx) {
				if ((changed.Object || changed.documentsData) && img_src_value !== (img_src_value = "images/covers/Cover-" + ctx.document.title.replace(/ /g, '-') + ".jpg")) {
					img.src = img_src_value;
				}

				if ((changed.Object || changed.documentsData) && a0_href_value !== (a0_href_value = "/story?id=" + ctx.document.id)) {
					a0.href = a0_href_value;
				}

				if ((changed.Object || changed.documentsData) && text1_value !== (text1_value = ctx.document.title)) {
					setData(text1, text1_value);
				}

				if ((changed.Object || changed.documentsData) && a1_href_value !== (a1_href_value = "/story?id=" + ctx.document.id)) {
					a1.href = a1_href_value;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div2);
				}
			}
		};
	}

	// (22:26)        Loading...       {:then documentsData}
	function create_pending_block(component, ctx) {
		var text;

		return {
			c() {
				text = createText("Loading...");
			},

			m(target, anchor) {
				insert(target, text, anchor);
			},

			p: noop,

			d(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	function Dashboard(options) {
		init(this, options);
		this._state = assign(assign({ Object : Object }, data()), options.data);

		this._recompute({  }, this._state);
		this._intro = true;

		if (!document.getElementById("svelte-1efp7mf-style")) add_css();

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Dashboard.prototype, proto);

	Dashboard.prototype._recompute = function _recompute(changed, state) {
		if (this._differs(state.userData, (state.userData = userData(exclude(state, "userData"))))) changed.userData = true;
		if (this._differs(state.documentsData, (state.documentsData = documentsData(exclude(state, "documentsData"))))) changed.documentsData = true;
	};

	/* src/components/Story.html generated by Svelte v2.15.1 */

	function storyData(data) {
	  return fetch(data.storyUrl)
	    .then(res => res.json())
	    .then(data => data);
	}

	function data$1() {
	  return {
	    storyText: "It was raining heavily...",
	    storyUrl: "/storyData?id="
	  }
	}
	var methods = {
	  submit() {
	    const storyEdit = document.getElementById("storyEdit"),
	          storyField = document.getElementById("storyField"),
	          storyContent = document.getElementById("storyContent");
	    this.set({story: storyEdit.innerHTML});
	    storyContent.submit();
	  }
	};

	function add_css$1() {
		var style = createElement("style");
		style.id = 'svelte-1ghc9i6-style';
		style.textContent = "h1.svelte-1ghc9i6{text-align:center}.story.svelte-1ghc9i6{width:100%;border:none;outline:none;color:#666;margin:3rem 0}.container.svelte-1ghc9i6{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;grid-gap:50px}";
		append(document.head, style);
	}

	function create_main_fragment$1(component, ctx) {
		var div3, div1, h1, text1, div0, text2, form, textarea, text3, div2;

		return {
			c() {
				div3 = createElement("div");
				div1 = createElement("div");
				h1 = createElement("h1");
				h1.textContent = "Title";
				text1 = createText("\n    \n    ");
				div0 = createElement("div");
				text2 = createText("\n    ");
				form = createElement("form");
				textarea = createElement("textarea");
				text3 = createText("\n  ");
				div2 = createElement("div");
				div2.innerHTML = `<img src="" alt="">`;
				h1.className = "svelte-1ghc9i6";
				div0.className = "story svelte-1ghc9i6";
				div0.id = "storyEdit";
				div0.contentEditable = true;
				textarea.rows = "4";
				textarea.cols = "50";
				textarea.name = "content";
				textarea.value = ctx.storyText;
				form.hidden = true;
				form.action = "/storySubmission";
				form.method = "POST";
				form.id = "storyContent";
				div1.className = "edit";
				div2.className = "illustration";
				div3.className = "container -split svelte-1ghc9i6";
			},

			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div1);
				append(div1, h1);
				append(div1, text1);
				append(div1, div0);
				append(div1, text2);
				append(div1, form);
				append(form, textarea);
				append(div3, text3);
				append(div3, div2);
			},

			p(changed, ctx) {
				if (changed.storyText) {
					textarea.value = ctx.storyText;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div3);
				}
			}
		};
	}

	function Story(options) {
		init(this, options);
		this._state = assign(data$1(), options.data);

		this._recompute({  }, this._state);
		this._intro = true;

		if (!document.getElementById("svelte-1ghc9i6-style")) add_css$1();

		this._fragment = create_main_fragment$1(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Story.prototype, proto);
	assign(Story.prototype, methods);

	Story.prototype._recompute = function _recompute(changed, state) {
		if (this._differs(state.storyData, (state.storyData = storyData(exclude(state, "storyData"))))) changed.storyData = true;
	};

	function Store(state, options) {
	  this._handlers = {};
	  this._dependents = [];
	  this._computed = blankObject();
	  this._sortedComputedProperties = [];
	  this._state = assign({}, state);
	  this._differs = options && options.immutable ? _differsImmutable : _differs;
	}

	assign(Store.prototype, {
	  _add(component, props) {
	    this._dependents.push({
	      component: component,
	      props: props
	    });
	  },

	  _init(props) {
	    const state = {};

	    for (let i = 0; i < props.length; i += 1) {
	      const prop = props[i];
	      state['$' + prop] = this._state[prop];
	    }

	    return state;
	  },

	  _remove(component) {
	    let i = this._dependents.length;

	    while (i--) {
	      if (this._dependents[i].component === component) {
	        this._dependents.splice(i, 1);

	        return;
	      }
	    }
	  },

	  _set(newState, changed) {
	    const previous = this._state;
	    this._state = assign(assign({}, previous), newState);

	    for (let i = 0; i < this._sortedComputedProperties.length; i += 1) {
	      this._sortedComputedProperties[i].update(this._state, changed);
	    }

	    this.fire('state', {
	      changed,
	      previous,
	      current: this._state
	    });

	    this._dependents.filter(dependent => {
	      const componentState = {};
	      let dirty = false;

	      for (let j = 0; j < dependent.props.length; j += 1) {
	        const prop = dependent.props[j];

	        if (prop in changed) {
	          componentState['$' + prop] = this._state[prop];
	          dirty = true;
	        }
	      }

	      if (dirty) {
	        dependent.component._stage(componentState);

	        return true;
	      }
	    }).forEach(dependent => {
	      dependent.component.set({});
	    });

	    this.fire('update', {
	      changed,
	      previous,
	      current: this._state
	    });
	  },

	  _sortComputedProperties() {
	    const computed = this._computed;
	    const sorted = this._sortedComputedProperties = [];
	    const visited = blankObject();
	    let currentKey;

	    function visit(key) {
	      const c = computed[key];

	      if (c) {
	        c.deps.forEach(dep => {
	          if (dep === currentKey) {
	            throw new Error(`Cyclical dependency detected between ${dep} <-> ${key}`);
	          }

	          visit(dep);
	        });

	        if (!visited[key]) {
	          visited[key] = true;
	          sorted.push(c);
	        }
	      }
	    }

	    for (const key in this._computed) {
	      visit(currentKey = key);
	    }
	  },

	  compute(key, deps, fn) {
	    let value;
	    const c = {
	      deps,
	      update: (state, changed, dirty) => {
	        const values = deps.map(dep => {
	          if (dep in changed) dirty = true;
	          return state[dep];
	        });

	        if (dirty) {
	          const newValue = fn.apply(null, values);

	          if (this._differs(newValue, value)) {
	            value = newValue;
	            changed[key] = true;
	            state[key] = value;
	          }
	        }
	      }
	    };
	    this._computed[key] = c;

	    this._sortComputedProperties();

	    const state = assign({}, this._state);
	    const changed = {};
	    c.update(state, changed, true);

	    this._set(state, changed);
	  },

	  fire,
	  get,
	  on,

	  set(newState) {
	    const oldState = this._state;
	    const changed = this._changed = {};
	    let dirty = false;

	    for (const key in newState) {
	      if (this._computed[key]) throw new Error(`'${key}' is a read-only computed property`);
	      if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	    }

	    if (!dirty) return;

	    this._set(newState, changed);
	  }

	});

	var store = new Store({
	  name: 'world'
	});
	var DashboardComponent = new Dashboard({
	  target: document.querySelector('.app'),
	  store: store
	});
	var StoryComponent = new Story({
	  target: document.querySelector('.story'),
	  store: store
	});
	window.store = store; // useful for debugging!

}());
