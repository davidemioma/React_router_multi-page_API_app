import { useParams, Route, Link, useRouteMatch } from "react-router-dom";
import Comments from "../components/comments/Comments";
import HighlitedQuotes from "../components/quotes/HighlightedQuote";
import NoQuoteFound from "../components/quotes/NoQuotesFound";
import { getSingleQuote } from "../lib/api";
import useHttp from "../hooks/use-http";
import { useEffect } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function QuoteDetails() {
  const param = useParams();

  const match = useRouteMatch();

  const id = param.quoteID;

  const {
    sendRequest,
    status,
    data: loadedQuote,
    error,
  } = useHttp(getSingleQuote, true);

  useEffect(() => {
    sendRequest(id);
  }, [sendRequest, id]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="centered focused">{error}</p>;
  }

  if (!loadedQuote.quote) {
    return <NoQuoteFound />;
  }

  return (
    <div>
      <HighlitedQuotes text={loadedQuote.quote} author={loadedQuote.author} />

      <Route path={`${match.path}`} exact>
        <div className="centered">
          <Link className="btn--flat" to={`${match.url}/comments`}>
            Add Comment
          </Link>
        </div>
      </Route>

      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </div>
  );
}

export default QuoteDetails;
