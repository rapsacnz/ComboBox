({


    init: function(component, event, helper) {
      helper.init(component);
    },

    /**
     * Search an SObject for a match
     */
    search: function(component, event, helper) {
      helper.doSearch(component);
    },

    /**
     * Select an SObject from a list
     */
    select: function(component, event, helper) {

      helper.handleSelection(component, event);
    },

    /**
     * Clear the currently selected SObject
     */
    clear: function(component, event, helper) {

      helper.clearSelection(component);
      event.preventDefault();
      return false;
    },


    handleBlur: function(component, event, helper) {
      helper.handleBlur(component);
    },

    handleFocus: function(component, event, helper) {
      helper.handleFocus(component);
    },

  })
