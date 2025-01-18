export const NotionConfig = {
  API_URL: 'https://idn-remote-jobs.notion.site/api/v3/queryCollection',
  IDN_REMOTE_JOBS_ID: 'b283a30c-b670-4512-a4dd-c96210a2ca95',
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
  LIST_MESSAGE_OPTIONS: {
    header: 'Remote Jobs for IDN Talents 🇮🇩',
    body: '\nThis list contains remote vacancies that are open to Indonesian talents. Every vacancy here is crowd-sourced from the community.\n\nWhile every effort is made to maintain accuracy and safety _(including regular content moderation)_, we encourage you to verify details independently.\n',
    actionButton: 'Remote Jobs',
    footer: '❤️‍🔥 Powered by Notion, Ghazlabs & Semboja',
  },
};
