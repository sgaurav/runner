/**
 * ACL Layer for server. Uses Node ACL for resource level access control.
 * Attribute level controls are achieved using custom express middleware
 * built on top of acl middleware.
 */

var node_acl = require('acl');
var conf = require('./conf');
var redis = require('./redis');