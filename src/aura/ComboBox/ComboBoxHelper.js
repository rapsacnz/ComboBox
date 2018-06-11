({
    init: function(component) {

    },

    doSearch: function(component) {

      var self = this;
      var search = component.get("v.searchString");
      if (!search || search.length < 2) {
        //show by default
        var showList = component.get("v.showList");
        if (!showList){
          component.set("v.filteredList", []);
          this.despatchFilterListEvent(component, []);
        }
        else {
          //if different, put back and despatch event to tell parent to reverse filter
          var filtered = component.get("v.filteredList");
          var full = component.get("v.fullList");
          if (filtered.length < full.length) {
            component.set("v.filteredList", full);
            this.despatchFilterListEvent(component, full);
          }
        }
        this.showResults(component);
        return;
      }

      var searchKeys = component.get("v.searchKeys");
      var list = component.get("v.fullList");
      var filteredList = [];
      var filteredListDisplay = [];

      list.forEach(function(obj) {

        if (self.isMatch(obj, searchKeys, search)) {
          filteredList.push(obj);
        }
      });


      //now fill in the dispay list (if we are displaying)
      if (component.get("v.showList")) {
        filteredList.forEach(function(obj) {
          var matches = self.getValues(obj, searchKeys, []);
          if (matches.length) {
            filteredListDisplay.push(matches);
          }
        });
        component.set("v.filteredListDisplay", filteredListDisplay);

      }


      component.set("v.filteredList", filteredList);
      //console.log(JSON.stringify(filteredList));
      //console.log(JSON.stringify(filteredListDisplay));

      this.showResults(component);
      this.despatchFilterListEvent(component, filteredList);

    },

    //recursive object treversal - currently only traverses deeper arrays
    isMatch: function(searchItem, searchKeys, searchValue) {
      self = this;

      //if a normal property, and matches, we are done
      //looping on keys first as assume that this is a smaller list than the attribute list
      var match = searchKeys.some(function(key) {
        if (!Array.isArray(searchItem[key])) {
          if (searchItem[key] && searchItem[key].search(new RegExp(searchValue, "i")) > -1) {
            return true;
          }
        }
      });
      if (match) {
        return match;
      }

      //else, check for deeper arrays
      match = Object.keys(searchItem).some(function(searchItemElement) {
        if (Array.isArray(searchItemElement)) {
          searchItemElement.some(function(searchItemArray) {
            return self.isMatch(searchItemArray, searchKeys, searchValue);
          });
        }
      });

      return match;

    },

    //recursive object treversal - returns a array based on supplied keys
    getValues: function(searchItem, searchKeys, resultArray) {
      self = this;
      if (Array.isArray(searchItem)) {
        searchItem.forEach(function(searchArrayItem) {
          return self.getValues(searchArrayItem, searchKeys, resultArray);
        });
      } else {
        searchKeys.forEach(function(key) {
          if (searchItem[key]) {
            resultArray.push(searchItem[key]);
          }
        });
        return resultArray;
      }
    },

    showResults: function(component, show) {

      var mainDiv = component.find('combobox-div');
      var search = component.get("v.searchString");

      if (component.get("v.filteredList").length > 0 && search.length > 2) {
        $A.util.addClass(mainDiv, 'slds-is-open');
      } else {
        $A.util.removeClass(mainDiv, 'slds-is-open');
      }
    },

    handleFocus: function(component) {

      this.showResults(component);

    },

    handleBlur: function(component) {

      var mainDiv = component.find('combobox-div');
      $A.util.removeClass(mainDiv, 'slds-is-open');
    },

    despatchFilterListEvent: function(component, value) {
      var compEvent = component.getEvent("listfiltered");
      compEvent.setParams({ "data": value });
      compEvent.fire();
    }

  })
