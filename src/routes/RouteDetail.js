import React from 'react';

function RouteDetail({route}) {
  return (
    <div>
      <hr/>
      { route.expired ? <div className="alert alert-warning"><strong>Expired Route</strong> This route is expired and will be decommissioned soon.</div> : null }
      <dl className="row">
        <dt className="col-3">Created</dt>
        <dd className="col-9">{route.created}</dd>
        <dt className="col-3">Author</dt>
        <dd className="col-9">{route.author}</dd>
        <dt className="col-3">Sector</dt>
        <dd className="col-9">{route.sector}</dd>
      </dl>
      <a href={`http://wallonsight.com/routes/detail/${route.id}`} target="_blank">More Details</a>
    </div>
  )
}

export default RouteDetail;
