var Command = module.exports = function Command(name, cli) {
    this.cli = cli;
    this._config = {
        command: name,
        description: '',
        optional: {}
    };
};


Command.prototype.title = function(title){
    this._config.title = title; // chalk.bold(chalk.yellow(title));
    return this;
};

Command.prototype.subtitles = function(value){
    this._config.subtitles = value; // chalk.bold(chalk.yellow(title));
    return this;
};

Command.prototype.usage = function(usage){
    this._config.usage = usage;
    return this;
};

Command.prototype.description = function(description){
    this._config.description = description;
    return this;
};


Command.prototype.custom = function(custom){
    this._config.custom = custom;
    return this;
};



Command.prototype.optional = function(optional){
    this._config.optional = optional;
    return this;
};

Command.prototype.method = function(method){
   this._config.method = method;
   this.cli._commands.push(this._config);
};
