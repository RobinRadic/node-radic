
//    console.log('global', global);
//    console.log('routes', routes);
    var FP = Function.prototype,
        AP = Array.prototype,
        OP = Object.prototype;

    var bindbind = FP.bind.bind(FP.bind),
        callbind = bindbind(FP.bind),
        applybind = bindbind(FP.apply);

    var has = callbind(OP.hasOwnProperty),
        slice = callbind(AP.slice),
        flatten = applybind(AP.concat, []);

    var filter_ = AP.filter,
        map_ = AP.map,
        push_ = AP.push,
        slice_ = AP.slice;


    function decorate(o) {
        var b, c, d;
        for (var i = 1; b = arguments[i]; i++) {
            for (c in b) {
                if (d = Object.getOwnPropertyDescriptor(b, c)) {
                    if (d.get || d.set) {
                        Object.defineProperty(o, c, d);
                    } else {
                        o[c] = d.value;
                    }
                }
            }
        }
        return o;
    }

    function isObject(o) {
        return o != null && typeof o === 'object' || typeof o === 'function';
    }

    function isIndexed(o) {
        return Array.isArray(o) || isObject(o) && has(o, 'length') && has(o, o.length - 1);
    }

// ############
// ### Path ###
// ############

    function Path(a) {
        if (isIndexed(a)) {
            push_.apply(this, a);
        }
    }

    Path.prototype.length = 0;

    decorate(Path.prototype, {
        join: Array.prototype.join,
        map: Array.prototype.map,
        concat: function concat() {
            var out = new Path(this);
            push_.apply(out, arguments);
            return out;
        },
        args: function args() {
            return filter_.call(this, function (s) {
                return s[0] === 'Δ';
            }).map(function (s) {
                return s.replace(/Δ/g, '');
            });
        },
        toName: function toName(slice, last) {
            var array = map_.call(this, function (s) {
                return s.replace(/Δ/g, '');
            });

            if (last) {
                array.push(last);
            }

            var out = array.slice(slice || 1).map(function (s) {
                return s[0].toUpperCase() + s.slice(1).toLowerCase();
            });

            if (!out[0]) {
                return '';
            } else {
                out[0] = out[0].toLowerCase();
                return out.join('').replace(/_(.)/g, function (s) {
                    return s[1].toUpperCase();
                });
            }
        },
        slice: function slice() {
            return new Path(slice_.apply(this, arguments));
        }
    });

    function makeCtor(args, api) {
        var Ctor = function () {
            var self = this instanceof Ctor ? this : Object.create(Ctor.prototype);
            return api.request(arguments, args, self);
        }

        decorate(Ctor, {
            args: Object.freeze(args),
            toString: function toString() {
                return '[ ' + this.args.join(', ') + ' ]'
            }
        });
        return Ctor;
    }

    // #################
    // ### APIClient ###
    // #################

    // generalized REST API handler that turns routes into functions

    function APIClient(routes, onlyGetters) {
        var self = this;
        var slices = {};

        function recurse(o, path) {
            Object.keys(o).forEach(function (k) {
                if (k === 'SLICE') {
                    slices[path[0]] = o[k];
                } else if (k.toUpperCase() === k) {
                    if (onlyGetters) {
                        if (k !== 'GET') return;
                        console.log(k);
                        var name = path.toName(slices[path[0]]);
                    } else {
                        var name = path.toName(slices[path[0]], k);
                    }

                    if (name) {
                        var target = self[path[0]] || (self[path[0]] = {});
                    } else {
                        name = path[0];
                        var target = self;
                    }

                    target[name] = makeCtor(path.args().concat(o[k]), self);

                    Object.defineProperty(target[name].prototype, 'path', {
                        get: function () {
                            return path.map(function (s) {
                                return s[0] === 'Δ' ? this[s.slice(1)] : s;
                            }, this).join('/');
                        }
                    });

                } else if (isObject(o[k])) {
                    recurse(o[k], path.concat(k));
                }
            });
        }

        recurse(routes, new Path);
    }

    /*decorate(APIClient.prototype, {
        request: function request(args, fields, req) {
            args = [].slice.call(args);
            var callback = typeof args[args.length - 1] === 'function' ? args.pop() : this.callback;
            fields.forEach(function (p, i) {
                if (typeof args[i] != null) {
                    req[p] = args[i];
                }
            });
            var transport = decorate(Object.create(this.transport), {
                path: req.path,
                data: req
            });

            return transport.send(callback);
        },
        setTransport: function setTransport(type, base, dispatcher) {
            Object.defineProperty(this, 'transport', {
                value: Transport.create(type, base, dispatcher),
                configurable: true,
                writable: true
            });
        }
    });*/

    module.exports = APIClient;

