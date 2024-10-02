import CONFIGURATION from '../../shared/environment';
import React, { useState } from 'react';
import { Close, TrashBin } from '@amsterdam/asc-assets';
import { themeSpacing, List, ListItem, Link, themeColor, Button } from '@amsterdam/asc-ui';
import styled from 'styled-components';
import { useRegions } from '../../services/regions';
import RegionMap from './RegionMap';
import './style.scss';
import SensorDeleteModal from './SensorDeleteModal';
import { formatEmail } from '../../utils/formatEmail';

export interface Props {
  feature: any | null;
  onClose: () => void;
}

const ButtonStyled = styled(Button)`
  justify-content: center;
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const InfoContainer = styled('div')`
  padding-top: ${themeSpacing(1)};
  padding-bottom: ${themeSpacing(1)};
  border-bottom: 2px solid ${themeColor('tint', 'level2')};
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 14px;
  right: 20px;
  min-width: inherit;

  > span {
    margin-right: 0;
  }
`;

const DeviceDetailsWrapper = styled.section`
  position: relative;
`;

const DeviceDetails: React.FC<Props> = ({ feature, onClose }) => {
  const regions = useRegions();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!feature) {
    return null;
  }

  const {
    sensorType,
    organisation,
    privacy,
    contact,
    activeUntil,
    goal,
    legalGround,
    reference,
    containsPiData,
    regions: sensorRegions,
  } = feature.properties;

  return (
    <DeviceDetailsWrapper id="device-details">
      <CloseButton
        type="button"
        variant="blank"
        title="Legenda"
        data-testid="legenda"
        iconSize={20}
        onClick={onClose}
        iconLeft={<Close />}
      />

      {sensorRegions?.length > 0 && <RegionMap regions={sensorRegions} />}

      <InfoContainer>
        <h3>Verantwoordelijke voor de sensor</h3>
        <List variant="bullet">
          <ListItem>{contact?.name}</ListItem>
          <ListItem>{organisation}</ListItem>
          {contact?.email?.length > 1 && <ListItem>{contact?.email}</ListItem>}
          <ListItem>{!!containsPiData ? 'Verwerkt persoonsgegevens' : 'Verwerkt geen persoonsgegevens'}</ListItem>
          {Array.isArray(privacy) &&
            privacy.length > 0 &&
            privacy.map((p, index) => (
              <ListItem key={index}>
                <Link href={p} variant="inline" icon="external" target="_blank">
                  Privacyverklaring
                </Link>
              </ListItem>
            ))}
        </List>
      </InfoContainer>

      <InfoContainer>
        <h3>Sensorgegevens</h3>
        <List variant="bullet">
          <ListItem>{sensorType}</ListItem>
          <ListItem>{regions ? 'Mobiele sensor' : 'Vaste sensor'}</ListItem>
          {reference && <ListItem>Referentie: {reference}</ListItem>}
          {sensorRegions && regions && (
            <ListItem>Gebied: {sensorRegions.map((r: string) => regions[r.toLowerCase()]?.naam).join(', ')}</ListItem>
          )}
        </List>
      </InfoContainer>

      {Array.isArray(goal) && goal.length > 0 && (
        <InfoContainer>
          <h3>Doel van de sensor</h3>
          <List variant="bullet">
            {(goal as string[]).map((g) => (
              <ListItem key={g}>{g}</ListItem>
            ))}
          </List>
        </InfoContainer>
      )}

      {Array.isArray(legalGround) && legalGround.length > 0 && (
        <InfoContainer>
          <h3>Wettelijke grondslag</h3>
          <List variant="bullet">
            {(legalGround as string[]).map((l) => (
              <ListItem key={l}>{l}</ListItem>
            ))}
          </List>
        </InfoContainer>
      )}

      <InfoContainer>
        <h3>Sensor actief tot</h3>
        <List variant="bullet">
          <ListItem>{activeUntil}</ListItem>
        </List>
      </InfoContainer>

      <ButtonStyled
        iconLeft={<TrashBin />}
        variant="secondary"
        type="button"
        onClick={() => {
          setIsDeleteModalOpen(true);
        }}
      >
        Verwijder Sensor
      </ButtonStyled>

      <SensorDeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        sensorId={feature.properties.id} // Pass sensor ID to the modal
        email={formatEmail(contact?.email)}
      />
    </DeviceDetailsWrapper>
  );
};

export default DeviceDetails;
