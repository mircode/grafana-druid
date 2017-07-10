import angular from 'angular';
import './editor.css!';
import {CodeMirror,SqlFormater} from './editor.js';	

export default class SQLEditor {
	
	constructor() {
		var module = angular.module('grafana.directives');
		module.directive('sqlCodemirror', this.directive);
		
	}

	directive() {
		
		return {
			    restrict: 'EA',
			    require: '?ngModel',
			    compile: function compile() {
			      return link;
			    }
	    }
		
	    function link(scope, iElement, iAttrs, ngModel) {
				var def = {
			        lineNumbers: true,
			        mode:'text/x-sql',
			        theme:'blackboard',
			        width:'100%',
			        styleActiveLine: true,
					matchBrackets: true
				 }
			    var options = angular.extend(
			    	{value:iElement.text()},
			      	scope.$eval(iAttrs.sqlCodemirror),
			      	scope.$eval(iAttrs.sqlCodemirrorOpts)||def
			    );
			
			    var editor=CodeMirror.fromTextArea(iElement[0], options);
			    editor.on('change', function(instance) {
				      var newValue = instance.getValue();
				      if (newValue !== ngModel.$viewValue) {
				        scope.$evalAsync(function() {
				          ngModel.$setViewValue(newValue);
				        });
				      }
			    });
			
			    if (!ngModel) { return; }
			    
			    ngModel.$formatters.push(function(value) {
				      if (angular.isUndefined(value) || value === null) {
				        return '';
				      } else if (angular.isObject(value) || angular.isArray(value)) {
				        throw new Error('sql-codemirror cannot use an object or an array as a model');
				      }
				      return value;
			    });
		
			    ngModel.$render = function() {
				      var sql = ngModel.$viewValue || '';
		  			  var res=SqlFormater.format(sql.replace(';',''), {});
		  			  if(typeof res ==="string") sql=res;
				      editor.setValue(sql);
			    };
    	}
	}
	  
  
  	format(sql){
  		try{
  			return SqlFormater.format(sql.replace(';',''), {});
  		}catch(err){
  			return sql;
  		}
  	}

}