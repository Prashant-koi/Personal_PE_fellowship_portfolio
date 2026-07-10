#!/usr/bin/env bash
# Tests the /api/timeline_post POST and GET endpoints.

BASE_URL="${BASE_URL:-http://localhost:5000}"
ENDPOINT="$BASE_URL/api/timeline_post"

# generating random post data
SUFFIX="$RANDOM$RANDOM"
NAME="Test User $SUFFIX"
EMAIL="test$SUFFIX@example.com"
CONTENT="Random test content $SUFFIX"

echo "POST $ENDPOINT"
echo "name:    $NAME"
echo "email:   $EMAIL"
echo "content: $CONTENT"

# Create the post with curl
POST_RESPONSE=$(curl -s -f \
    --data-urlencode "name=$NAME" \
    --data-urlencode "email=$EMAIL" \
    --data-urlencode "content=$CONTENT" \
    "$ENDPOINT")

# store the post id
POST_ID=$(echo "$POST_RESPONSE" | jq -r '.id')

echo "POST response: $POST_RESPONSE" 
echo

# the GET request to get it
echo "GET $ENDPOINT"
GET_RESPONSE=$(curl -s -f "$ENDPOINT")

if echo "$GET_RESPONSE" | grep -q "$CONTENT"; then
    echo "TEST PASSED created post found in GET response."
    RESULT=0
else
    echo "TEST FAILED created post not found in GET response."
    echo "GET response: $GET_RESPONSE"
    RESULT=1
fi

# deleting the posts now
echo "DELETE $ENDPOINT/$POST_ID"
curl -s -f -X DELETE "$ENDPOINT/$POST_ID"

exit $RESULT
