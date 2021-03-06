import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import VirtualList from 'react-tiny-virtual-list';
import { toast } from 'react-toastify';

import * as scrapperActionCreator from '../../scrapperActionCreator';
import LoadingIndicator from '../../../../components/atoms/LoadingIndicator';
import Modal from '../../../../components/atoms/Modal';
import Message from '../../../../components/atoms/Message';
import translate from '../../../../locale';
import Row from '../../templates/Row';

import '../../Scrapper.scss';

const ScrapperListPage = ({
  scrapperState: { loading, savedLinks, errors, removeLinkSuccess, previewContent },
  scrapperActions
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // make api call at the begining to fetch all saved links
  useEffect(() => {
    scrapperActions.fetchSavedLinks();
  }, [scrapperActions]);

  // showing toaser message for successful removal of link
  useEffect(() => {
    if (removeLinkSuccess) {
      toast.success(translate('scrapper.removeSuccess'));
    }
  }, [removeLinkSuccess]);

  // show toast message if any errror occurrs
  useEffect(() => {
    if (errors) {
      toast.error(errors);
    }
  }, [errors]);

  // opening modal when preview content arrived
  useEffect(() => {
    if (previewContent) {
      setModalOpen(true);
    }
  }, [previewContent]);

  const onPreview = (link) => {
    scrapperActions.getLinkPreview(link);
  };

  const head = (
    <Helmet key="scrapper-page">
      <title>{translate('scrapper.listTitle')}</title>
      <meta property="og:title" content="Scrapper saved links" />
      <meta
        name="description"
        content="Get list of all hyperlinks available in a web page from a given URL"
      />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );

  const onRemoveBookmark = (index) => {
    const { id } = savedLinks[index];
    scrapperActions.removeLink(id);
  };

  return (
    <div className="scrapper-page-container row">
      {head}
      {loading && <LoadingIndicator />}
      {modalOpen && previewContent && (
        <Modal onClose={() => setModalOpen(false)} content={previewContent} />
      )}
      <div className="sub-title">{translate('scrapper.rowCountTitle', { COUNT: savedLinks.length })}</div>
      <div className="links-list-container">
        {savedLinks.length
          ? (
            <VirtualList
              height={400}
              width="100%"
              itemCount={savedLinks.length}
              itemSize={60}
              renderItem={({ index, style }) => {
                const { href, ...rest } = savedLinks[index];
                const rowProps = {
                  index,
                  style,
                  className: 'virtual-row',
                  isSaved: true,
                  href,
                  ...rest
                };

                return (
                  <Row
                    key={`list-row-${index.toString()}`}
                    onPreview={() => onPreview(href)}
                    {...rowProps}
                    onClick={onRemoveBookmark}
                  />
                );
              }}
            />
          )
          : <Message description={translate('scrapper.noSavedLink')} />
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  scrapperState: state.scrapper
});

const mapDispatchToProps = (dispatch) => ({
  scrapperActions: bindActionCreators(scrapperActionCreator, dispatch)
});

ScrapperListPage.propTypes = {
  scrapperState: PropTypes.object,
  scrapperActions: PropTypes.object
};

ScrapperListPage.defaultProps = {
  scrapperState: {},
  scrapperActions: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScrapperListPage);
