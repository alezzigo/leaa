import cx from 'classnames';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, InputNumber, Row } from 'antd';

import { useTranslation } from 'react-i18next';

import { Product } from '@leaa/common/src/entrys';
import { messageUtil } from '@leaa/dashboard/src/utils';

import { FormCard, SwitchNumber, EntryInfoDate, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  item?: Product;
  className?: string;
  loading?: boolean;
  onValidateFieldsCallback?: (e: any) => void;
}

export const ProductInfoForm = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onValidateForm = async () => {
    try {
      return await form.validateFields();
    } catch (error) {
      return messageUtil.gqlError(error.errorFields[0]?.errors[0] || 'ERROR!');
    }
  };

  const formatInitialValues = (item?: Product): Product | {} => {
    if (!item) {
      return {
        status: 1,
      };
    }

    return {
      ...item,
      styleIds: item?.styles?.length ? item.styles[0].id : undefined,
      brandIds: item?.brands?.length ? item.brands[0].id : undefined,
    };
  };

  useEffect(() => {
    if (props.item) form.setFieldsValue(formatInitialValues(props.item));
  }, [props.item]);

  useImperativeHandle(ref, () => ({
    form,
    onValidateForm,
  }));

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <FormCard
        title={t('_page:Product.Component.productInfo')}
        extra={<EntryInfoDate date={props.item && [props.item.created_at, props.item.updated_at]} />}
      >
        <Form form={form} name="infoForm" layout="vertical" initialValues={formatInitialValues(props.item)}>
          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={8}>
              <Form.Item name="name" label={t('_page:Product.Component.productName')} rules={[{ required: true }]}>
                <Input placeholder={t('_page:Product.Component.productName')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="fullname"
                label={t('_page:Product.Component.productFullname')}
                rules={[{ required: true }]}
              >
                <Input placeholder={t('_lang:fullname')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="serial" label={t('_lang:serial')} rules={[{ required: true }]}>
                <Input placeholder={t('_lang:serial')} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={2}>
              <Form.Item
                name="status"
                normalize={e => e && Number(e)}
                label={t('_page:Product.Component.putOnSale')}
                rules={[{ required: true }]}
              >
                <SwitchNumber />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={4}>
              <Form.Item name="price" label={t('_page:Product.Component.price')} rules={[{ required: true }]}>
                <InputNumber placeholder={t('_lang:price')} className={style['input-number']} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="cost_price" label={t('_page:Product.Component.costPrice')} rules={[]}>
                <InputNumber placeholder={t('_page:Product.Component.costPrice')} className={style['input-number']} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={4}>
              <Form.Item name="market_price" label={t('_page:Product.Component.marketPrice')} rules={[]}>
                <InputNumber placeholder={t('_page:Product.Component.marketPrice')} className={style['input-number']} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item
                name="styleIds"
                normalize={e => e && Number(e)}
                label={t('_page:Product.Component.style')}
                rules={[{ required: true }]}
              >
                <SelectCategoryIdByTree parentSlug="products" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                name="brandIds"
                normalize={e => e && Number(e)}
                label={t('_page:Product.Component.brand')}
                rules={[{ required: true }]}
              >
                <SelectCategoryIdByTree parentSlug="brands" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} className={style['form-row']}>
            <Col xs={24} sm={4}>
              <Form.Item name="stock" label={t('_lang:stock')} rules={[{ required: true }]}>
                <InputNumber placeholder={t('_lang:stock')} className={style['input-number']} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </div>
  );
});
