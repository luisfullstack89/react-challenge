import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, message, Col } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import SearchQueryBuilderContext from './SearchQueryBuilderContext';
import SearchQueryBuilderTree from './SearchQueryBuilderTree';
import { THEME_PREFIX } from '../util/constants';
import axios from 'axios'
import { defaultStyles, defaultConditions, defaultConfig, defaultTheme, defaultUiConfig, defaultSelectInfo } from '../assets/defaults';
import { applyTheme, merged, resetTheme, scroll2BeginningOf } from '../util/helpers';
import { sqlize } from '../util/outputFormatters';
import { useToggler } from './hooks/common';
import '../assets/query-builder.styles.scss';
import EmployeeTable from './components/EmployeeTable';

function QueryBuilder({
  mainConfig = defaultConfig,
  mainSelectInfo = defaultSelectInfo,
  conditions = defaultConditions,
  defaultSelectedConditionIndex = 0,
  defaultQuery = {},
  onSubmit,
  theme = defaultTheme,
  onReset,
  uiConfig = defaultUiConfig,
  minimalMode,
  styles = defaultStyles,
  outputType,
  ...rest
}) {
  const [isBuildingMode, enableBuildingMode, disableBuildingMode] = useToggler(true);
  const rootRef = useRef(null);
  const [form] = Form.useForm();
  const [renderEmp , setRenderEmp]= useState(false)
  const [emp , setEmp] = useState([])

  const margeStyles = () => {
    const actualStyles = {};
    actualStyles.Collapsing = defaultStyles.Collapsing ? merged(defaultStyles.Collapsing, styles.Collapsing) : styles.Collapsing;
    if (actualStyles.Collapsing.size < 38) {
      actualStyles.Collapsing.size = 38;
    }
    actualStyles.FormBorders = defaultStyles.FormBorders ? merged(defaultStyles.FormBorders, styles.FormBorders) : styles.FormBorders;
    actualStyles.TreeLines = defaultStyles.TreeLines ? merged(defaultStyles.TreeLines, styles.TreeLines) : styles.TreeLines;
    actualStyles.Footer = defaultStyles.Footer ? merged(defaultStyles.Footer, styles.Footer) : styles.Footer;
    return actualStyles;
  };

  useLayoutEffect(() => {
    if (minimalMode) {
      resetTheme(rootRef.current, theme, THEME_PREFIX);
    } else {
      applyTheme(rootRef.current, theme, THEME_PREFIX);
      const actualStyles = margeStyles();
      applyTheme(rootRef.current, { collapsingSize: actualStyles.Collapsing.size + actualStyles.Collapsing.measurement }, THEME_PREFIX);
      applyTheme(rootRef.current, { formBorderWidth: actualStyles.FormBorders.width.size + actualStyles.FormBorders.width.measurement }, THEME_PREFIX);
      applyTheme(rootRef.current, { formBorderStyle: actualStyles.FormBorders.style }, THEME_PREFIX);
      applyTheme(rootRef.current, { formBorderRadius: actualStyles.FormBorders.radius.size + actualStyles.FormBorders.width.measurement }, THEME_PREFIX);
      applyTheme(rootRef.current, { treeLines: actualStyles.TreeLines.width.size + actualStyles.TreeLines.width.measurement }, THEME_PREFIX);
      applyTheme(rootRef.current, { footer: actualStyles.Footer.justify_content }, THEME_PREFIX);
    }
  }, [rootRef, theme, minimalMode, styles]);

  const format = (query) => {
    if (outputType === 'sql-string') {
      console.warn('SQL Formatter is not completely implemented yet.');
      return sqlize(query);
    } else {
      return query;
    }
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form Values:', values);
      const categories = extractCategories(values);

      Object.keys(values).forEach(async(x)=>{if (x==='ID1586350327393'){
      const response = await axios.get(`http://localhost:8000/employee?categories=${values[x].category}`);
      console.log('this is the res : ', response)
      setRenderEmp(true)
      setEmp(response.data.emp)
 handleApiResponse(response);
      }} )
      
 message.success('employee fetched!')
    } catch (error) {
      message.error('Failed to submit the form. Please check the inputs.');
      console.log(error)
    }
  };

  const extractCategories = (values) => {
    const categories = [];
    Object.keys(values).forEach((key) => {
      if (key.includes('CATEGORY')) {
        categories.push(values[key]);
      }
    });
    return categories;
  };

  const handleApiResponse = (data) => {
    console.log('API Response:', data);
    // Update the UI based on the API response
  };

  const context = {
    mainConfig,
    mainSelectInfo,
    conditions,
    defaultSelectedConditionIndex,
    onSubmit: (query) => {
      if (styles) {
        scroll2BeginningOf(rootRef.current);
        disableBuildingMode();
      }
      onSubmit(format(query));
    },
    onReset: (query) => {
      onReset && onReset(format(query));
    },
    defaultQuery,
    theme: merged(defaultTheme, theme),
    uiConfig: merged(defaultUiConfig, uiConfig),
    minimalMode,
    form,
  };

  return (
    <SearchQueryBuilderContext.Provider value={context}>
      <div ref={rootRef} className={'query-builder-main'}>
        <div style={{ display: 'flex', flexDirection: 'column' }} className={`query-builder-main-container ${!isBuildingMode ? 'query-builder-building-mode' : ''} `}>
          <Row className={!isBuildingMode ? 'collapses-visible' : 'collapses-hidden'}>
            <DoubleRightOutlined onClick={() => { enableBuildingMode(); }} />
          </Row>
          <Form form={form} onFinish={handleFormSubmit}>
            <Form.Item>
              <SearchQueryBuilderTree isBuildingMode={isBuildingMode} />
            </Form.Item>
            <Row className="main-buttons" gutter={10} justify="center">
              <Col>
                <button type="submit" className="build-button">
                  FIND
                </button>
              </Col>
            </Row>
          </Form>
        </div>

        <div>
        </div>
      </div>
        {renderEmp? (<EmployeeTable employees={emp}/>) : ('')}

    </SearchQueryBuilderContext.Provider>
  );
}

const buttonStyleSpecs = PropTypes.shape({
  icon: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
});

QueryBuilder.propTypes = {
  mainConfig: PropTypes.shape({
    [PropTypes.string]: PropTypes.arrayOf(
      PropTypes.exact({
        key: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        format: PropTypes.string,
        priority: PropTypes.string,
        fieldType: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.exact({
            name: PropTypes.string,
          })
        ),
      })
    ),
  }),
  mainSelectInfo: PropTypes.exact({
    key: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  }),
  conditions: PropTypes.arrayOf(PropTypes.string),
  defaultSelectedConditionIndex: PropTypes.number,
  defaultQuery: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  outputType: PropTypes.oneOf(['sql-string', 'json']),
  theme: PropTypes.exact({
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    accentColor: PropTypes.string,
    lightestColor: PropTypes.string,
    darkestColor: PropTypes.string,
  }),
  styles: PropTypes.exact({
    FormBorders: PropTypes.exact({
      width: PropTypes.exact({
        size: PropTypes.number,
        measurement: PropTypes.oneOf(['px', 'em', '%', 'vh']),
      }),
      style: PropTypes.string,
      radius: PropTypes.oneOfType([
        PropTypes.exact({
          size: PropTypes.number,
          measurement: PropTypes.oneOf(['px', 'em', '%', 'vh']),
        }),
        PropTypes.bool,
      ]),
    }),
    TreeLines: PropTypes.exact({
      width: PropTypes.exact({
        size: PropTypes.number,
        measurement: PropTypes.oneOf(['px', 'em', '%', 'vh']),
      }),
    }),
    Footer: PropTypes.exact({
      justify_content: PropTypes.oneOf(['center', 'flex-end', 'flex-start', 'space-around', 'space-between']),
    }),
    Collapsing: PropTypes.oneOfType([
      PropTypes.exact({
        size: PropTypes.number,
        measurement: PropTypes.oneOf(['px', 'em', '%', 'vh']),
      }),
      PropTypes.bool,
    ]),
  }),
  minimalMode: PropTypes.bool,
  uiConfig: PropTypes.shape({
    addRuleButton: buttonStyleSpecs,
    addGroupButton: buttonStyleSpecs,
    buildButton: buttonStyleSpecs,
    resetButton: buttonStyleSpecs,
    deleteButton: buttonStyleSpecs,
    mainContainer: PropTypes.object,
  }),
};

QueryBuilder.defaultProps = {
  mainConfig: defaultConfig,
  mainSelectInfo: defaultSelectInfo,
  conditions: defaultConditions,
  defaultSelectedConditionIndex: 0,
  defaultQuery: {},
  theme: defaultTheme,
  uiConfig: defaultUiConfig,
  styles: defaultStyles,
};

export default QueryBuilder;
