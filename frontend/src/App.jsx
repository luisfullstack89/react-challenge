import React from 'react'
import QueryBuilder from '../src/search-query-builder/SearchQueryBuilderForm'
import './App.css'

const App = () => {

  const theme = {
  primaryColor: "purple",
  secondaryColor: "black",
  accentColor: "orange",
  lightestColor: "white",
  darkestColor: "black",
};

const uiConfig = {
  addRuleButton: {
    text: "RULE",
    className: "add-rule-btn",
    icon: "plus",
  },
  addGroupButton: {
    text: "GROUP",
    className: "add-group-btn",
    icon: "plus-circle",
  },
  buildButton: {
    text: "BUILD",
    className: "build-btn",
  },
  resetButton: {
    text: "RESET",
    className: "reset-btn",
  },
};

const mainConfig = {
  CATEGORY: [
    {
      placeholder: "Category",
      key: "category",
      type: "select",
      priority: "required",
      items: [
        {
          name: "First",
        },
        {
          name: "Second",
        },
        {
          name: "Third",
        },
      ],
    },
    {
      placeholder: "Date",
      key: "date",
      type: "date",
      priority: "not_required",
      format: "DD-MM-YYYY",
    },
  ],
};

const defaultQuery = {
  condition: "OR",
  type: "group",
  id: "ID1586350327391",
  childrens: {
    ID1586350327393: {
      type: "rule",
      properties: {
        type: "CATEGORY",
        category: "Third",
      },
    },
    ID1586350327395: {
      type: "rule",
      properties: {
        type: "CATEGORY",
        category: "First",
        date: "03-05-2020",
      },
    },
  },
};

const conditions = ["AND", "OR"];

const mainSelectInfo = {
  placeholder: "Criteria",
  key: "type",
};

const minimalMode = false;

const outputType = "json";

const styles = {
  FormBorders: {
    width: {
      size: 10,
      measurement: "px",
    },
    style: "double",
    radius: {
      size: 35,
      measurement: "px",
    },
  },
  TreeLines: {
    width: {
      size: 5,
      measurement: "px",
    },
  },
  Footer: {
    justify_content: "flex-end",
  },
  Collapsing: {
    size: 88,
    measurement: "px",
  },
};

  function handleOnSubmit(query) {
  console.log('Query Submitted:', query);
}

function handleOnReset(query) {
  console.log('Query Reset:', query);
}
  return (<>
    
     <QueryBuilder
      mainConfig={mainConfig} // all options is required
      uiConfig={uiConfig} // elements configuration [in progress]
      theme={theme} // colors
      minimalMode={minimalMode} // everything black and white
      mainSelectInfo={mainSelectInfo} // info for main select ( placeholder and key )
      conditions={conditions} // all conditions default [AND OR]
      defaultSelectedConditionIndex={0} // selected selected condition default [0]
      defaultQuery={defaultQuery} //elements which will be selected default [none]
      outputType={outputType} // type of the parameter below default json [[TBD]]
      onSubmit={handleOnSubmit}
       onReset={handleOnReset}
      styles={styles} // styles related to borders of form, to tree lines, to fotter and colapsing
    />
    </>
  )
}

export default App