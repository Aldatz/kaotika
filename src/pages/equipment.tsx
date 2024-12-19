import KaotikaNextButton from '@/components/KaotikaNextButton';
import KaotikaBackButton from '@/components/KaotikaPrevbutton';
import Layout from '@/components/Layout';
import { Tooltip } from '@nextui-org/react';
import { Progress } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { Profile } from '@/_common/interfaces/Profile';
import DefenseTooltip from '@/components/tooltips/DefenseTooltip';
import WeaponTooltip from '@/components/tooltips/WeaponTooltip';
import ArtifactTooltip from '@/components/tooltips/CommonTooltip';
import HealingPotionTooltip from '@/components/tooltips/HealingPotionTooltip';
import AntidotePotionTooltip from '@/components/tooltips/AntidotePotionTooltip';
import EnhancerPotionTooltip from '@/components/tooltips/EnhancerPotionTooltip';
import { Armor } from '@/_common/interfaces/Armor';
import { Modifier } from '@/_common/interfaces/Modifier';
import { Weapon } from '@/_common/interfaces/Weapon';
import { Artifact } from '@/_common/interfaces/Artifact';
import { HealingPotion } from '@/_common/interfaces/HealingPotion';
import { AntidotePotion } from '@/_common/interfaces/AntidotePotion';
import { EnhancerPotion } from '@/_common/interfaces/EnhancerPotion';
import { PROGRESS_LABEL, PROGRESS_VALUE } from '@/constants/constants';

const Equipment = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>();
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>();
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact>();
  const [selectedHealingPotion, setSelectedHealingPotion] = useState<HealingPotion>();
  const [selectedAntidotePotion, setSelectedAntidotePotion] = useState<AntidotePotion>();
  const [selectedEnhancerPotion, setselectedEnhancerPotion] = useState<EnhancerPotion>();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [armorModifiers, setArmorModifiers] = useState<Modifier>({
    intelligence: 0,
    dexterity: 0,
    constitution: 0,
    insanity: 0,
    charisma: 0,
    strength: 0
  });
  const [weaponModifiers, setWeaponModifiers] = useState<Modifier>({
    intelligence: 0,
    dexterity: 0,
    constitution: 0,
    insanity: 0,
    charisma: 0,
    strength: 0
  });
  const [artifactModifiers, setArtifactModifiers] = useState<Modifier>({
    intelligence: 0,
    dexterity: 0,
    constitution: 0,
    insanity: 0,
    charisma: 0,
    strength: 0
  });

  const [hitPoints, setHitPoints] = useState(0);
  const [attack, setAttack] = useState(0);
  const [defense, setDefense] = useState(0);
  const [magicResistance, setmagicResistance] = useState(0);
  const [cfp, setCFP] = useState(0);
  const [bcfa, setBCFA] = useState(0);
  const [loading, setLoading] = useState(false);
  const [classroomId, setClassroomId] = useState(null);


  useEffect(() => {
    const profile = router.query.profile;
    setCurrentProfile(JSON.parse(profile as string));
  }, []);

  useEffect(() => {
    calculateHitPoints();
    calculateAttack();
    calculateDefense();
    calculateMagicResistance();
    calculateCFP();
    calculateBCFA();
  }, [currentProfile])

  useEffect(() => {
    calculateHitPoints();
    calculateAttack();
    calculateDefense();
    calculateMagicResistance();
    calculateCFP();
    calculateBCFA();
  }, [armorModifiers, weaponModifiers, artifactModifiers])

  const handleNext = async() => {
    setLoading(true);
    const fetchClassroomUserProfile = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch('/api/classroom/student', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken: session.accessToken }),
          });

          const data = await response.json();
          setClassroomId(data.id);
        } catch (error) {
          console.error('Error fetching Classroom user profile:', error);
        }
      }
    };

    fetchClassroomUserProfile();
    
  };

  useEffect(() => {
    if(classroomId)registerPlayer();
  }, [classroomId])
  
  const registerPlayer = async () => {
    const nickname = sessionStorage.getItem('nickname');
    console.log("Registering player");
    const response = await fetch('/api/player/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  
        name: session?.user?.name,
        nickname: nickname,
        email: session?.user?.email,
        avatar: session?.user?.image,
        classroom_Id: classroomId,
        profile: currentProfile?._id,
        equipment:{
          armor: selectedArmor?._id,
          weapon: selectedWeapon?._id, 
          artifact:selectedArtifact?._id,
          healing_potion: selectedHealingPotion?._id,
          antidote_potion: selectedAntidotePotion?._id,
          enhancer_potion: selectedEnhancerPotion?._id
        }         
      }),
    });

    if (response.ok) {
      router.push('/player');
    } else {
      // Handle error
      console.error('Failed to register player');
      setLoading(false);
    }
  }
  const handleBack = () => {
    router.push('/player');
  };

  const handleSelectedArmor = (armor: Armor) => {
    if(selectedArmor === armor) {      
      return;
    }
    
    setSelectedArmor(armor);
  }

  const handleSelectedWeapon = (weapon: Weapon) => {
    if(selectedWeapon === weapon) {      
      return;
    }

    setSelectedWeapon(weapon);
  }

  const handleSelectedArtifact = (artifact: Artifact) => {
    if(selectedArtifact === artifact) {      
      return;
    }
   
    setSelectedArtifact(artifact);
  }

  useEffect(() => {
    if(selectedArmor)setArmorModifiers(selectedArmor?.modifiers)   
  }, [selectedArmor]);

  useEffect(() => {
    if(selectedWeapon)setWeaponModifiers(selectedWeapon?.modifiers) 
  }, [selectedWeapon]);

  useEffect(() => {
    if(selectedArtifact) setArtifactModifiers(selectedArtifact.modifiers);    
  }, [selectedArtifact]);

 
  const calculateHitPoints = (): void => {
    if (!currentProfile) return ;
    const dexterity = currentProfile.attributes.find(attr => attr.name === 'Dexterity')?.value || 0;
    const insanity = currentProfile.attributes.find(attr => attr.name === 'Insanity')?.value || 0;
    const constitution = currentProfile.attributes.find(attr => attr.name === 'Constitution')?.value || 0;
    setHitPoints((dexterity + armorModifiers.dexterity  + weaponModifiers.dexterity + artifactModifiers.dexterity + constitution + armorModifiers.constitution + weaponModifiers.constitution + artifactModifiers.constitution) - (insanity + armorModifiers.insanity + weaponModifiers.insanity + artifactModifiers.insanity)/2); 
  };

  const calculateAttack = (): void => {
    if(!currentProfile) return;
    const strength = currentProfile.attributes.find(attr => attr.name === 'Strength')?.value || 0;
    const insanity = currentProfile.attributes.find(attr => attr.name === 'Insanity')?.value || 0;
    setAttack((strength + armorModifiers.strength + weaponModifiers.strength + artifactModifiers.strength) - ((insanity + armorModifiers.insanity + weaponModifiers.insanity + artifactModifiers.insanity)/2));
  }

  const calculateDefense = (): void => {
    if(!currentProfile) return;
    const dexterity = currentProfile.attributes.find(attr => attr.name === 'Dexterity')?.value || 0;
    const constitution = currentProfile.attributes.find(attr => attr.name === 'Constitution')?.value || 0;
    const intelligence = currentProfile.attributes.find(attr => attr.name === 'Intelligence')?.value || 0;
    setDefense((dexterity + armorModifiers.dexterity + weaponModifiers.dexterity + artifactModifiers.dexterity) + (constitution + armorModifiers.constitution + weaponModifiers.constitution + artifactModifiers.constitution) + ((intelligence + armorModifiers.intelligence + weaponModifiers.intelligence + artifactModifiers.intelligence)/2));
  }

  const calculateMagicResistance = (): void => {
    if(!currentProfile) return;
    const intelligence = currentProfile.attributes.find(attr => attr.name === 'Intelligence')?.value || 0;
    const charisma = currentProfile.attributes.find(attr => attr.name === 'Charisma')?.value || 0;
    setmagicResistance((intelligence + armorModifiers.intelligence + weaponModifiers.intelligence + artifactModifiers.intelligence) + (charisma + armorModifiers.charisma + weaponModifiers.charisma + artifactModifiers.charisma));

  }

  const calculateCFP = (): void => {
    if(!currentProfile) return;
    const insanity = currentProfile.attributes.find(attr => attr.name === 'Insanity')?.value || 0;
    setCFP((insanity + armorModifiers.insanity + weaponModifiers.insanity + artifactModifiers.insanity));
  }

  const calculateBCFA =(): void => {
    if(!currentProfile) return;
    const strength = currentProfile.attributes.find(attr => attr.name === 'Strength')?.value || 0;
    const insanity = currentProfile.attributes.find(attr => attr.name === 'Insanity')?.value || 0;
    setBCFA((strength + armorModifiers.strength + weaponModifiers.strength + artifactModifiers.strength) + (insanity + armorModifiers.insanity + weaponModifiers.insanity + artifactModifiers.insanity));
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
    <div className="flex flex-col text-medievalSepia bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url(/images/map.jpg)'}}>
      <div className="flex justify-center">
        <div className="w-1/4 p-4">
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Armor</h2>
            <div className="w-full p-5 grid grid-cols-3 gap-4 border-1 rounded-lg border-sepia bg-black/70">
              {currentProfile?.equipment.armors.map((armor) => (
                <Tooltip key={armor._id} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" placement='top' closeDelay={0} size='sm' showArrow={true} content={<DefenseTooltip element={armor} equiped={null}/>}>
                <img
                  key={armor._id}
                  src={armor.image}
                  alt={armor.description}
                  className={`w-full h-full object-contain sepia hover:sepia-0 cursor-pointer p-2 transition rounded-full ${selectedArmor?._id === armor._id ? 'border-3 sepia-0 border-sepia ' : ''}`}
                  style={{'border': '2px ridge #c28b56'}}
                  onClick={() => handleSelectedArmor(armor)}
                />
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Weapons</h2>
            <div className="w-full p-5 grid grid-cols-3 gap-4 border-1 rounded-lg border-sepia bg-black/70">
              {currentProfile?.equipment.weapons.map((weapon) => (
                <Tooltip key={weapon._id} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" placement="right" closeDelay={0} size='sm' showArrow={true}  content={<WeaponTooltip element={weapon} equiped={null}/>}>
                <img
                  key={weapon._id}
                  src={weapon.image}
                  alt={weapon._id}
                  className={`w-full h-full object-contain sepia hover:sepia-0 cursor-pointer p-2 transition rounded-full ${selectedWeapon?._id === weapon._id ? 'border-3 sepia-0 border-medievalSepia' : ''}`}
                  style={{'border': '2px ridge #c28b56'}}
                  onClick={() => handleSelectedWeapon(weapon)}
                />
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Artifacts</h2>
            <div className="w-full p-5 grid grid-cols-3 gap-4 border-1 rounded-lg border-sepia bg-black/70">
              {currentProfile?.equipment.artifacts.map((artifact) => (
                <Tooltip key={artifact._id} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" size='sm' closeDelay={0} showArrow={true} content={<ArtifactTooltip element={artifact} equiped={null}/>}>
                <img
                  key={artifact._id}
                  src={artifact.image}
                  alt={artifact.description}
                  className={`w-full h-full object-contain sepia hover:sepia-0 cursor-pointer p-2 transition rounded-full ${selectedArtifact?._id === artifact._id ? 'border-3 sepia-0 border-sepia' : ''}`}
                  style={{'border': '2px ridge #c28b56'}}
                  onClick={() => handleSelectedArtifact(artifact)}
                />
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/4 p-4">
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Healing Potions</h2>
            <div className="w-full p-5 grid grid-cols-3 gap-4 border-1 rounded-lg border-sepia bg-black/70">
              {currentProfile?.equipment.healing_potions.map((potion) => (
                <Tooltip key={potion._id} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" size='sm' closeDelay={0} showArrow={true} content={<HealingPotionTooltip element={potion} equiped={null}/>}>
                <img
                  key={potion._id}
                  src={potion.image}
                  alt={potion.description}
                  className={`w-full h-full object-contain sepia hover:sepia-0 cursor-pointer p-2 transition rounded-full ${selectedHealingPotion?._id === potion._id ? 'border-3 sepia-0 border-sepia' : ''}`}
                  style={{'border': '2px ridge #c28b56'}}
                  onClick={() => {setSelectedHealingPotion(potion)}}
                  
                />
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Antidote Potions</h2>
            <div className="w-full p-5 grid grid-cols-3 gap-4 border-1 rounded-lg border-sepia bg-black/70">
              {currentProfile?.equipment.antidote_potions.map((potion) => (
                <Tooltip key={potion._id} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" size='sm' closeDelay={0} showArrow={true} content={<AntidotePotionTooltip element={potion} equiped={null}/>}>
                <img
                  key={potion._id}
                  src={potion.image}
                  alt={potion.description}
                  className={`w-full h-full object-contain sepia hover:sepia-0 cursor-pointer p-2 transition rounded-full ${selectedAntidotePotion?._id === potion._id ? 'border-3 sepia-0 border-sepia' : ''}`}
                  style={{'border': '2px ridge #c28b56'}}
                  onClick={() => {setSelectedAntidotePotion(potion)}}
                />
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Enhancer Potions</h2>
            <div className="w-full p-5 grid grid-cols-3 gap-4 border-1 rounded-lg border-sepia bg-black/70">
              {currentProfile?.equipment.enhancer_potions.map((potion) => (
                <Tooltip key={potion._id} className="w-96 text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" size='sm' closeDelay={0} showArrow={true} content={<EnhancerPotionTooltip element={potion} equiped={null}/>}>
                <img
                  key={potion._id}
                  src={potion.image}
                  alt={potion.description}
                  className={`w-full h-full object-contain sepia hover:sepia-0 cursor-pointer p-2 transition rounded-full ${selectedEnhancerPotion?._id === potion._id ? 'border-3 sepia-0 border-medievalSepia' : ''}`}
                  style={{'border': '2px ridge #c28b56'}}
                  onClick={() => {setselectedEnhancerPotion(potion)}}
                />
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4">
          <div className="flex flex-col items-center m-4">
            <h2 className="text-4xl mb-4">Inventory</h2>
            <div className="w-full p-5 grid grid-cols-6 gap-12 border-1 rounded-lg border-sepia bg-black/70">
              {selectedArmor ? <img src={currentProfile?.equipment.armors.find(armor => armor._id === selectedArmor._id)?.image} 
                key={selectedArmor._id}
                alt="Selected Armor" 
                className="w-full h-full object-contain rounded-full" 
                style={{'border': '3px ridge #c28b56'}} />
                :
                <img key={"img_0"} src="/images/img.jpg" alt="Inventory" className="w-full h-full object-contain rounded-full" style={{'border': '3px ridge #c28b56'}} />
              }
              {selectedWeapon ? <img src={currentProfile?.equipment.weapons.find(weapon => weapon._id === selectedWeapon._id)?.image} 
                key={selectedWeapon._id}
                alt="Selected Weapon" 
                className="w-full h-full object-contain rounded-full" 
                style={{'border': '3px ridge #c28b56'}} />
                :
                <img key={"img_1"} src="/images/img.jpg" alt="Inventory" className="w-full h-full object-contain rounded-full" style={{'border': '3px ridge #c28b56'}} />
              }
              {selectedArtifact ? <img src={currentProfile?.equipment.artifacts.find(artifact => artifact._id === selectedArtifact._id)?.image} 
                alt="Selected Artifact" 
                className="w-full h-full object-contain rounded-full" 
                style={{'border': '3px ridge #c28b56'}} />
                :
                <img key={"img_2"} src="/images/img.jpg" alt="Inventory" className="w-full h-full object-contain rounded-full" style={{'border': '3px ridge #c28b56'}} />
              }
              {selectedHealingPotion ? <img src={currentProfile?.equipment.healing_potions.find(potion => potion._id === selectedHealingPotion._id)?.image} 
                alt="Selected Healing Potion" 
                className="w-full h-full object-contain rounded-full" 
                style={{'border': '3px ridge #c28b56'}} />
                :
                <img key={"img_3"} src="/images/img.jpg" alt="Inventory" className="w-full h-full object-contain rounded-full" style={{'border': '3px ridge #c28b56'}}
              />}
              {selectedAntidotePotion ? <img src={currentProfile?.equipment.antidote_potions.find(potion => potion._id === selectedAntidotePotion._id)?.image} 
                alt="Selected Antidote Potion" 
                className="w-full h-full object-contain rounded-full"
                style={{'border': '3px ridge #c28b56'}} />
                :
                <img key={"img_4"} src="/images/img.jpg" alt="Inventory" className="w-full h-full object-contain rounded-full" style={{'border': '3px ridge #c28b56'}}  
              />}
              {selectedEnhancerPotion ? <img src={currentProfile?.equipment.enhancer_potions.find(potion => potion._id === selectedEnhancerPotion._id)?.image} 
                alt="Selected Enhanced Potion" 
                className="w-full h-full object-contain rounded-full"
                style={{'border': '3px ridge #c28b56'}} />
                :
                <img key={"img_5"} src="/images/img.jpg" alt="Inventory" className="w-full h-full object-contain rounded-full" style={{'border': '3px ridge #c28b56'}}  
              />}
            </div> 
            <div className="w-full flex flex-col items-center m-4">
              <h2 className="text-4xl mb-4">{currentProfile?.name} attributes</h2> 
              <div className="w-full p-5 border-1 rounded-lg border-sepia bg-black/70">
                <Progress
                  key={"p-1"}
                  size="lg" 
                  radius="sm"
                  minValue={0}
                  maxValue={300}
                  classNames={{
                    track: "drop-shadow-md border border-sepia h-2",
                    indicator: "bg-medievalSepia h-2",
                    label: PROGRESS_LABEL,
                    value: PROGRESS_VALUE,
                  }}
                  formatOptions={{style: "decimal"}}
                  label="Hit Points based on CON + DEX - INS/2"
                  value={hitPoints}
                  showValueLabel={true}
                />
                <Progress
                  key={"p-2"}
                  size="lg" 
                  radius="sm"
                  minValue={0}
                  maxValue={100}
                  classNames={{
                    track: "drop-shadow-md border border-sepia h-2",
                    indicator: "bg-medievalSepia h-2",
                    label: PROGRESS_LABEL,
                    value: PROGRESS_VALUE,
                  }}
                  formatOptions={{style: "decimal"}}
                  label="Attack based on STR - INS / 2"
                  value={attack}
                  showValueLabel={true}
                />  
                <Progress
                  key={"p-3"}
                  size="lg" 
                  radius="sm"
                  minValue={0}
                  maxValue={100}
                  classNames={{
                    track: "drop-shadow-md border border-sepia h-2",
                    indicator: "bg-medievalSepia h-2",
                    label: PROGRESS_LABEL,
                    value: PROGRESS_VALUE,
                  }}
                  formatOptions={{style: "decimal"}}
                  label="Defense based on DEX + CON + INT/2"
                  value={defense}
                  showValueLabel={true}
                />
                <Progress
                  key={"p-4"}
                  size="lg" 
                  radius="sm"
                  minValue={0}
                  maxValue={100}
                  classNames={{
                    track: "drop-shadow-md border border-sepia h-2",
                    indicator: "bg-medievalSepia h-2",
                    label: PROGRESS_LABEL,
                    value: PROGRESS_VALUE,
                  }}
                  formatOptions={{style: "decimal"}}
                  label="Magic resistance based on INT + CHA"
                  value={magicResistance}
                  showValueLabel={true}
                />  
                <Progress
                  key={"p-5"}
                  size="lg" 
                  radius="sm"
                  minValue={0}
                  maxValue={100}
                  classNames={{
                    track: "drop-shadow-md border border-sepia h-2",
                    indicator: "bg-medievalSepia h-2",
                    label: PROGRESS_LABEL,
                    value: PROGRESS_VALUE,
                  }}
                  formatOptions={{style: "decimal"}}
                  label="CFP (critical or fumble probability) based on INS"
                  value={cfp}
                  showValueLabel={true}
                />  
                <Progress
                  key={"p-6"}
                  size="lg" 
                  radius="sm"
                  minValue={0}
                  maxValue={100}
                  classNames={{
                    track: "drop-shadow-md border border-sepia h-2",
                    indicator: "bg-medievalSepia h-2",
                    label: PROGRESS_LABEL,
                    value: PROGRESS_VALUE,
                  }}
                  formatOptions={{style: "decimal"}}
                  label="BCFA (base critical & fumble attack) based on STR + INS"
                  value={bcfa}
                  showValueLabel={true}
                />  
              </div>
            </div> 
            <KaotikaNextButton handleNext={handleNext} />
            <KaotikaBackButton handleBack={handleBack} />                
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-1/3 p-4 text-center">
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Equipment;

