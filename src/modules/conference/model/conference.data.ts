import { ApiProperty } from '@nestjs/swagger';
import { conferences as Conference } from '@prisma/client';


export class ConferenceData {
    public static readonly NAME_LENGTH = 100;
    public static readonly ACRONYM_LENGTH = 10;
    @ApiProperty({ description: 'Conference unique ID', example: '75442486-0878-440c-9db1-a7006c25a39f' })
    public readonly id: string;

    @ApiProperty({ description: 'Conference name', example: 'John' })
    public readonly name: string  | null;

    @ApiProperty({ description: 'Conference acronym', example: 'CITA' })
    public readonly acronym: string  | null;


    public constructor(entity: Conference) {
        this.id = entity.id;
        this.name = entity.name as string;
        this.acronym = entity.acronym as string;
    }
}
