import _ from 'lodash';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';

import { User } from '@leaa/api/src/entrys';
import { envConfig } from '@leaa/dashboard/src/configs';
import { DEFAULT_QUERY } from '@leaa/dashboard/src/constants';
import { IPage, ICrudListQueryParams, ICrudListRes, IFetchRes } from '@leaa/dashboard/src/interfaces';
import {
  setCrudQueryToUrl,
  transUrlQueryToCrudState,
  genCrudRequestQuery,
  genCrudQuerySearch,
  httpErrorMsg,
} from '@leaa/dashboard/src/utils';
import { useSWR } from '@leaa/dashboard/src/libs';
import { PageCard, HtmlMeta, TableCard, SearchInput, NullTag } from '@leaa/dashboard/src/components';

import style from './style.module.less';

const API_PATH = 'users';

export default (props: IPage) => {
  const { t } = useTranslation();

  const [crudQuery, setCrudQuery] = useState<ICrudListQueryParams>({
    ...DEFAULT_QUERY,
    ...transUrlQueryToCrudState(window),
  });

  const list = useSWR<IFetchRes<ICrudListRes<User>>>(
    {
      url: `${envConfig.API_URL}/${envConfig.API_VERSION}/${API_PATH}`,
      params: genCrudRequestQuery(crudQuery),
      crudQuery,
    },
    {
      onError: httpErrorMsg,
      onSuccess: (res) => setCrudQueryToUrl({ window, query: res.config.crudQuery, replace: true }),
    },
  );

  useUpdateEffect(() => {
    if (_.isEqual(crudQuery, DEFAULT_QUERY)) list.mutate();
    else setCrudQuery(DEFAULT_QUERY);
  }, [props.history.location.key]);

  return (
    <PageCard
      route={props.route}
      title="@LIST"
      extra={
        <SearchInput
          className={cx('g-page-card-extra-search-input')}
          value={crudQuery.q}
          onSearch={(q?: string) => {
            return setCrudQuery({
              ...crudQuery,
              search: genCrudQuerySearch(q, {
                crudQuery,
                condition: { $and: [{ $or: [{ name: { $cont: q } }] }] },
                clear: { $and: [{ $or: undefined }] },
              }),
              q: q || undefined,
            });
          }}
        />
      }
      className={style['page-card-wapper']}
      loading={list.loading}
    >
      <HtmlMeta title={t(`${props.route?.namei18n}`)} />

      <TableCard
        route={props.route}
        routerName={API_PATH}
        crudQuery={crudQuery}
        setCrudQuery={setCrudQuery}
        //
        list={list.data?.data}
        mutate={list.mutate}
        //
        columnFields={[
          'id',
          'isAdmin',
          'avatar',
          {
            title: t('_lang:account'),
            width: 180,
            dataIndex: envConfig.PRIMARY_ACCOUNT_TYPE || 'email',
            sorter: true,
            ellipsis: true,
            textWrap: 'word-break',
            render: (text: string, record: any) => {
              const accountColDom = [
                <>{record.email || <NullTag nullText="----" />}</>,
                <>{record.phone || <NullTag nullText="----" />}</>,
              ];

              if (envConfig.PRIMARY_ACCOUNT_TYPE === 'phone') accountColDom.reverse();

              return (
                <Link to={`${props.route.path}/${record.id}`}>
                  <span>{accountColDom[0]}</span>
                  <br />
                  <small>{accountColDom[1]}</small>
                </Link>
              );
            },
          },
          'roleList',
          'createdAt',
          'status',
          { action: { fieldName: 'name' } },
        ]}
      />
    </PageCard>
  );
};
