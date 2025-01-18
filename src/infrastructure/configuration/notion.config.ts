export const NotionConfig = {
  API_URL: 'https://idn-remote-jobs.notion.site/api/v3/queryCollection',
  GET_OPTIONS: (limit: number) => ({
    source: {
      type: 'collection',
      id: '6534afc9-8e22-42ac-af39-4c6e42d65eab',
      spaceId: '1d5af3f1-6b55-49da-99b6-d9c8c2351a72',
    },
    collectionView: {
      id: 'ab0e36e1-9c73-48c3-a229-fb3c52dad9e0',
      spaceId: '1d5af3f1-6b55-49da-99b6-d9c8c2351a72',
    },
    loader: {
      reducers: {
        collection_group_results: {
          type: 'results',
          limit: limit,
        },
      },
      sort: [
        {
          property: '[`wx',
          direction: 'descending',
        },
        {
          property: 'JTLe',
          direction: 'descending',
        },
        {
          property: 'cTXG',
          direction: 'descending',
        },
      ],
      searchQuery: '',
      userTimeZone: 'Asia/Jakarta',
    },
  }),
};
