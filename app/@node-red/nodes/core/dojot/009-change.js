module.exports = function (RED) {
    'use strict';

    function GenericNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
    };

    RED.nodes.registerType('change', GenericNode);
};
