// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { GraphQLClient } from 'graphql-request';
import type { Artwork } from './artwork.model';

export async function load() {
    const hygraph = new GraphQLClient(
            'https://us-west-2.cdn.hygraph.com/content/cle656vk12eby01uihv5cg600/master',
            {
                headers: {},
            }
            );

    const { artworks } = await hygraph.request(
      `{
        artworks {
          made
          createdAt
          id
          title
          updatedAt
          tag
          file {
            id
            url
          }
        }
      }`
      );
    artworks.forEach((art: Artwork) => {
        art.tag = art.tag?.replace('_', ' ');
    });
    const { splashArts } = await hygraph.request(
      `{
        splashArts(where: { active: true }) {
          id
          splashArtImage {
            id
            url
          }
        }
      }`
      );
    const { signatures } = await hygraph.request(
      `{
          signatures(where: { active: true}) {
            signature {
              url
            }
          }
      }`
      );
    const res = await hygraph.request(
      `{
        __type(name: "Tags") {
          enumValues {
            name
          }
        }
      }`
      );
    const tags = res.__type.enumValues.map((tag: { name: string }) => tag.name.replace('_', ' '));

    return {
        props: {
            artworks,
            tags,
            splashArts,
            signatures,
        },
    };
}