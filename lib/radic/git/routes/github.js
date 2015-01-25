
var github = module.exports = {
    legacy: {SLICE: 1, issues: {search: {Δowner: {Δrepository: {Δstate: {Δkeyword: {GET: []}}}}}}, repos: {search: {Δkeyword: {GET: ['language', 'start_page']}}}, user: {search: {Δkeyword: {GET: []}}, email: {Δemail: {GET: []}}}},
    gists: {
        SLICE: 1,
        POST: ['description', 'public', 'files'],
        GET: ['page', 'per_page'],
        public: {GET: []},
        starred: {GET: []},
        Δid: {GET: [], PATCH: ['description', 'files'], star: {GET: [], DELETE: [], POST: []}, fork: {POST: []}, comments: {GET: [], POST: ['input'], Δid: {GET: [], DELETE: [], PATCH: ['body']}}}
    },
    teams: {SLICE: 2, Δid: {GET: [], DELETE: [], PATCH: ['name', 'permission'], members: {GET: ['page', 'per_page'], Δuser: {GET: [], DELETE: [], POST: []}}, repos: {GET: ['page', 'per_page'], Δuser: {Δrepo: {GET: [], DELETE: [], POST: []}}}}},
    orgs: {
        SLICE: 2,
        Δorg: {
            GET: ['page', 'per_page'],
            PATCH: ['billing_email', 'company', 'email', 'location', 'name'],
            members: {GET: ['page', 'per_page'], Δuser: {GET: [], DELETE: []}},
            public_members: {GET: [], Δuser: {GET: [], DELETE: [], POST: []}},
            teams: {GET: [], POST: ['name', 'repo_names', 'permission']},
            repos: {GET: ['type', 'page', 'per_page'], POST: ['name', 'description', 'homepage', 'private', 'has_issues', 'has_wiki', 'has_downloads', 'team_id'], Δsha: {GET: []}}
        }
    },
    repos: {
        SLICE: 3, Δuser: {
            Δrepo: {
                GET: [],
                GET2: ['page', 'per_page'],
                PATCH: ['name', 'description', 'homepage', 'private', 'has_issues', 'has_wiki', 'has_downloads'],
                contributors: {GET: ['anon', 'page', 'per_page']},
                languages: {GET: ['anon', 'page', 'per_page']},
                teams: {GET: ['page', 'per_page']},
                tags: {GET: ['page', 'per_page'], Δsha: {POST: ['tag', 'message', 'object', 'type', 'tagger.name', 'tagger.email', 'tagger.date']}},
                git: {refs: {POST: ['refs', 'sha'], GET: ['page', 'per_page'], Δref: {GET: [], PATCH: ['sha', 'force']}}, commits: {POST: ['message', 'tree', 'parents', 'author', 'committer'], Δsha: {GET: []}}, blobs: {POST: ['content', 'encoding'], Δsha: {GET: ['page', 'per_page']}}},
                branches: {GET: ['page', 'per_page']},
                events: {GET: ['page', 'per_page']},
                issues: {
                    GET: ['milestone', 'state', 'assignee', 'mentioned', 'labels', 'sort', 'direction', 'since', 'page', 'per_page'],
                    POST: ['title', 'body', 'assignee', 'milestone', 'labels'],
                    events: {GET: ['page', 'per_page'], GET2: [], Δid: {}},
                    Δnumber: {GET: [], PATCH: ['title', 'body', 'assignee', 'milestone', 'labels'], comments: {GET: ['page', 'per_page'], POST: ['body']}, events: {GET: ['page', 'per_page']}},
                    comments: {Δid: {GET: [], DELETE: [], PATCH: ['body']}},
                },
                pulls: {
                    GET: ['state', 'page', 'per_page'], POST: ['title', 'body', 'base', 'head'], POST2: ['issue', 'base', 'head'], Δnumber: {
                        GET: [], PATCH: ['state', 'title', 'body'], merge: {GET: ['page', 'per_page'], POST: ['commit_message']}, files: {GET: ['page', 'per_page']}, commits: {GET: ['page', 'per_page']},
                        comments: {POST: ['body', 'in_reply_to'], POST2: ['body', 'commit_id', 'path', 'position'], GET: ['page', 'per_page'],}
                    }, comments: {Δnumber: {GET: [], DELETE: [], PATCH: ['body']}}
                },
                commits: {GET: ['sha', 'path', 'page', 'per_page'], Δsha: {GET: [], comments: {GET: ['page', 'per_page'], POST: ['body', 'commit_id', 'line', 'path', 'position']}},},
                comments: {Δid: {GET: [], DELETE: [], PATCH: ['body']}},
                compare: {ΔbaseΔhead: {GET: ['base', 'head']}},
                download: {GET: ['page', 'per_page']},
                downloads: {Δid: {GET: [], DELETE: []}},
                forks: {POST: ['org'], GET: ['sort', 'page', 'per_page']},
                labels: {GET: [], POST: ['name', 'color'], Δname: {GET: [], POST: ['color']}},
                keys: {GET: ['page', 'per_page'], POST: ['title', 'key'], Δid: {GET: [], DELETE: [], POST: ['title', 'key']}},
                watchers: {GET: ['page', 'per_page']},
                hooks: {GET: ['page', 'per_page'], POST: ['name', 'config', 'events', 'active'], Δid: {GET: [], DELETE: [], PATCH: ['name', 'config', 'events', 'add_events', 'remove_events', 'active'], test: {POST: []}}},
                milestones: {POST: ['title', 'state', 'description', 'due_on'], GET: ['state', 'sort', 'page', 'per_page'], Δnumber: {DELETE: [], GET: [], PATCH: ['title', 'state', 'description', 'due_on']}},
                trees: {POST: ['tree'], Δsha: {GET: ['recursive']}},
                collaborators: {GET: ['page', 'per_page'], Δcollabuser: {GET: [], DELETE: [], POST: []}}
            }
        }
    },
    authorizations: {SLICE: 0, GET: []},
    user: {
        SLICE: 1,
        GET: [],
        PATCH: ['name', 'email', 'blog', 'company', 'location', 'hireable', 'bio'],
        gists: {GET: ['page', 'per_page']},
        emails: {GET: ['page', 'per_page'], DELETE: [], POST: []},
        following: {GET: ['page', 'per_page'], Δuser: {GET: ['page', 'per_page'], DELETE: [], POST: []}},
        watched: {GET: ['page', 'per_page'], Δuser: {Δrepo: {GET: ['page', 'per_page'], DELETE: [], POST: []}}},
        keys: {GET: ['page', 'per_page'], POST: ['title', 'key'], Δid: {GET: [], DELETE: [], PATCH: ['title', 'key']}},
        repos: {GET: ['type', 'page', 'per_page'], POST: ['name', 'description', 'homepage', 'private', 'has_issues', 'has_wiki', 'has_downloads']}
    },
    users: {
        SLICE: 2,
        Δuser: {
            GET: [],
            gists: {GET: ['page', 'per_page']},
            followers: {GET: ['page', 'per_page']},
            following: {GET: ['page', 'per_page']},
            orgs: {GET: ['page', 'per_page']},
            watched: {GET: ['page', 'per_page']},
            received_events: {GET: ['page', 'per_page']},
            events: {GET: ['page', 'per_page']},
            repos: {GET: ['type', 'page', 'per_page']}
        }
    },
    networks: {SLICE: 2, Δuser: {Δrepo: {events: {GET: ['page', 'per_page']}}, events: {orgs: {Δorg: {GET: ['page', 'per_page']}}}}},
    events: {SLICE: 1, GET: ['page', 'per_page']}
};

