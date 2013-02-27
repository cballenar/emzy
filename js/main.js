// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};


(function() {

  window.Emzy = {
    Models: {},
    Collections: {},
    Views: {},
    Helpers: {}
  };

  window.template = function(id) { return _.template( $('#' + id).html() ); };

  // Em Model
  Emzy.Models.Node = Backbone.Model.extend({
    validate: function(attrs) {
      if ( !$.trim(attrs.title) ) {
        return 'All nodes require a valid selector.';
      }
    },
    defaults: {
      id: '',
      parent: 'root',
      name: '.element',
      px: 16
    }
  });

  // Ems Collections
  Emzy.Collections.Nodes = Backbone.Collection.extend({
    model: Emzy.Models.Node
  });

  Emzy.Views.Nodes = Backbone.View.extend({
    className: 'projectList',

    initialize: function() {
      this.collection.on('add', this.addOne, this);
    },
    events: {

    },
    
    render: function() {
      this.collection.each(this.addOne, this);
      return this;
    },

    addOne: function(node) {
      var nodeView = new Emzy.Views.Node({ model: node });
      this.$el.append(nodeView.render().el);
    }

  });

  Emzy.Views.Node = Backbone.View.extend({
    className: 'node',
    template: template('nodeTemplate'),

    initialize: function() {
      this.model.on('setValue', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    events: {
      'blur .nodeInput': 'setValue',
      'keyup .nodeInput': 'getValue',
      'click .removeNode': 'destroy',
      'click .addChildNode': 'create'
    },


    getValue: function(e){
      var target = $(e.currentTarget),
          parentValue = 16,
          inputValue = target.val(),
          outputValue = this.calculate(inputValue, parentValue) + 'em',
          outputField = target.siblings('.nodeOutput');

      $(outputField).val( outputValue );
    },
    calculate: function( pxValue, parentValue ) {
      return this.roundValue( pxValue/parentValue );
    },
    roundValue: function(value){
      var temp = Math.round(value * Math.pow(10,4)) / Math.pow(10,4);
      return temp;
    },

    setValue: function(e){
      var inputValue = $(e.currentTarget).val();

      this.model.set({'px': inputValue });
      console.log(nodesView.el);
    },


    destroy: function(){
      this.model.destroy();
    },
    remove: function(){
      this.$el.remove();
    },

    create: function(e) {
      e.preventDefault();

      var node = new Emzy.Models.Node();
      this.collection.add(node);
    },


    render: function() {
      var template = this.template( this.model.toJSON() );
      this.$el.html(template);
      return this;
    }

  });


var nodesCollection = new Emzy.Collections.Nodes([
  { name: 'h1', px: 41 },
  { name: 'h2', px: 30 },
  { name: 'h3', px: 21 },
  { name: 'h4', px: 18 }
]);

var nodesView = new Emzy.Views.Nodes({ collection: nodesCollection });
$('.emzyApp').html(nodesView.render().el);

})();



/*
var Emzy = {
  start: function() {
    this.nodeEvents();
    this.createNode();
    this.deleteNode();
    this.rootNode();
  },

  number: /^[0-9\.]+$/,
  numberCanNeg: /^-?[0-9\.]+$/,

  // Return boolean if is the root element
  isRoot: function(element) { return element.hasClass('root'); },

  nodeEvents: function() {
    $(document).ready( function() {
      $('body')
        .on('click', '.toCss', Emzy.toCss )
        .on('click', '.emAddChild', Emzy.createNode )
        .on('click', '.emAddSibling', Emzy.createNode )
        .on('click', '.emRemove', Emzy.deleteNode )
        .on('dblclick', '.nodeName', function() { $(this).removeAttr('disabled'); } )
        .on('blur', '.nodeName', function() { $(this).attr('disabled', true); } )
        .on('keyup', '.pxInput', Emzy.getValues )
        .on('sortstart', function() { $('.nodeList').toggleClass('sortStart'); })
        .on('sortstop', function() { $('.nodeList').toggleClass('sortStart'); });
    });
  },

  newNode: function(root){
    var moveHandleHtml = '',
        addSiblingHtml = '',
        removeNodeHtml = '',
        rootNodeHtml = ' root',
        rootNodeClass = 'body';

    if (root === false) {
      moveHandleHtml = '<div class="handle"></div>',
      addSiblingHtml = '<a class="btn btn-small emAddSibling"><i class="icon-arrow-down"></i></a>',
      removeNodeHtml = '<a class="btn btn-small btn-danger emRemove"><i class="icon-remove icon-white"></i></a>',
      rootNodeHtml = '',
      rootNodeClass = 'element';
    }

    var $node =
          $('<div class="emBox'+rootNodeHtml+'"></div>'),
        nodeHtml = '<form class="form-inline">'+moveHandleHtml+'<div class="btn-group pull-right"><a class="btn btn-small emAddChild"><i class="icon-arrow-right"></i></a>'+addSiblingHtml+removeNodeHtml+'</div> <div class="formWrapper"><input type="text" class="nodeName" value="'+rootNodeClass+'" disabled><span> { </span><input type="text" class="pxInput" /><span> = </span><input type="text" class="emOutput" disabled /><span> }</span></div></form><div class="nodeList"></div>';

    $node.html(nodeHtml);

    return $node;
  },

  rootNode: function () {
    $(document).on('ready', function() {
      $('.emzyApp').append( Emzy.newNode(true) );
    });
  },

  sortableNode: function () {
    $('.root').sortable({
      connectWith: '.emzyApp .nodeList',
      //dropOnEmpty: true,
      cursorAt: {top:5, left:5},
      handle:'.handle',
      items: '.emBox',
      placeholder: 'placeholder'
    }).disableSelection();
  },

  createNode: function () {
    
    if ( $(this).hasClass('emAddChild') ) {
      $(this).parent().parent().siblings('.nodeList').append( Emzy.newNode(false) );
    } else {
      $(this).parent().parent().parent().parent().append( Emzy.newNode(false) );
    }
    Emzy.sortableNode();
  },

  deleteNode: function(){
    $(this).parent().parent().parent().remove();
  },

  roundEm: function(emValue) {
    var temp = Math.round(emValue * Math.pow(10,4)) / Math.pow(10,4);
    return temp;
  },

  getValues: function() {
    var rootInput = $('.root').children('form').children('.formWrapper').children('.pxInput'),
        parent = $(this).parent().parent().parent(),
        pxValue = $(this).val(),
        parentValue = ( (Emzy.isRoot(parent)) ? 16 : parent.parent().siblings('form').children('.formWrapper').children('.pxInput').val()),
        outputField = $(this).siblings('.emOutput');

    if ( !!$(rootInput).val() && !!$(this).val() && Emzy.number.test(pxValue) ) {
      // Remove error warning if number
      if ( $(this).hasClass('error') ) { $(this).removeClass('error'); }
      // Calculate and return values
      $(outputField).val( Emzy.calcEm(pxValue, parentValue) + 'em' );
    
    } else if ( !$(rootInput).val() && !!$(this).val() ) {
      if ( !$(rootInput).hasClass('error') ) { $(rootInput).addClass('error'); }
      $(outputField).val(0);
    
    } else {
      if ( !$(this).hasClass('error') ) { $(this).addClass('error'); }
    }

    if (Emzy.isRoot(parent)) {
      // Re calculate children values
      $(parent).find('div').filter('.emBox').each( function(){
        $(this).find('input').filter('.pxInput').each( Emzy.getValues );
      });
    }
  },

  calcEm: function( pxValue, parentValue ) {
    return Emzy.roundEm( pxValue/parentValue );
  },

  toCss: function() {
    var output = '';
    $('.emBox').each( function(index) {
      var nodeClass = $(this).children('form').children('.formWrapper').children('.nodeName').val(),
          nodeEmval = $(this).children('form').children('.formWrapper').children('.emOutput').val();
      
      output += nodeClass+' { font-size: '+nodeEmval+' }<br/>';
    });

    $('.emzyOutput').html('<pre>'+output+'</pre>');
  },

  genId: function(idLength) {
    var emId = '',
        validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i = idLength-1; i >= 0; i-- ) {
      emId += validChars.charAt( Math.floor( Math.random() * validChars.length ));
    }

    return emId;
  }

};

$( function () { Emzy.start(); });*/