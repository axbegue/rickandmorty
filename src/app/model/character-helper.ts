import { Character } from "./character";

export class CharacterHelper {
  public static getDescription(entity: Character): string {
    // {{slide.status + ', ' + slide.species + ', ' + slide.gender + ', ' + slide.origin!.name}}

    if (entity.gender == 'Male') {
      return `He is a ${entity.gender} ${entity.species} from ${entity.origin!.name}${(entity.status != 'unknown' ? ', he is ' + entity.status : '')}`;
    } else if (entity.gender == 'Female') {
      return `She is a ${entity.gender} ${entity.species} from ${entity.origin!.name}${(entity.status != 'unknown' ? ', she is ' + entity.status : '')}`;
    } else {
      return `It is a ${entity.gender} ${entity.species} from ${entity.origin!.name}${(entity.status != 'unknown' ? ', it is ' + entity.status : '')}`;
    }
  }
}
