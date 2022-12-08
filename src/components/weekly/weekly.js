import * as React from "react";
import moment from 'moment';
import 'moment/locale/ru';
import styled from "@mui/material/styles/styled";
import {ViewState, EditingState, IntegratedEditing} from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    Toolbar,
    TodayButton,
    DateNavigator,
    WeekView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    Resources,
    ConfirmationDialog,
    EditRecurrenceMenu,
} from "@devexpress/dx-react-scheduler-material-ui";
import { resourcesData } from '../../data/resources';



const formatDayScaleDate = (date, options) => {
    moment.locale('ru');
    const momentDate = moment(date);
    const { weekday } = options;
    return momentDate.format(weekday ? 'dddd' : 'D');
};

const PREFIX = 'Weekly';

const classes = {
    dayScaleCell: `${PREFIX}-dayScaleCell`,
};

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)({
    [`&.${classes.dayScaleCell}`]: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

const DayScaleCell = ((
    { formatDate, ...restProps },
) => (
    <StyledWeekViewDayScaleCell
        {...restProps}
        formatDate={formatDayScaleDate}
        className={classes.dayScaleCell}
    />
));



const AppointmentContainer = ({
                                  style, ...restProps
                              }) => (
    <Appointments.Container
        {...restProps}
        style={{
            ...style,
            width: '20%',
        }}
    />
);

const Appointment = ({
                         children, style, ...restProps
                     }) => (
    <Appointments.Appointment
        {...restProps}
        style={{
            ...style,
            borderRadius: '8px',
        }}
    >
        {children}
    </Appointments.Appointment>
);



const BasicLayoutAppointmentForm = ({ onFieldChange, appointmentData, ...restProps }) => {
    return (
        <AppointmentForm.BasicLayout
            appointmentData={appointmentData}
            onFieldChange={onFieldChange}
            {...restProps}
        />
    );
};

const TextEditorAppointmentForm = (props) => {
    if (props.type === 'multilineTextEditor') {
        return null;
    } return <AppointmentForm.TextEditor {...props} />;
};



const AppointmentFormMessages = {
    moreInformationLabel: '',
    detailsLabel: 'Событие:',
    allDayLabel: 'Весь день',
    titleLabel: 'Наименование',
    repeatLabel: 'Периодичность',
    commitCommand:'Сохранить',
    daily:'Ежедневно',
    weekly:'Еженедельно',
    monthly:'Ежемесячно',
    yearly:'Ежегодно',
    repeatEveryLabel:'Каждые',
    daysLabel:'дня',
    weeksOnLabel:'недели',
    monthsLabel:'месяца',
    yearsLabel:'года',
    endRepeatLabel:'Закончить:',
    never:'Никогда',
    onLabel:'',
    occurrencesLabel:'повторений',
    afterLabel:'После',
    ofEveryMonthLabel:'числа',
    theLabel:'',
    firstLabel:'Первая',
    secondLabel:'Вторая',
    thirdLabel:'Третья',
    fourthLabel:'Четвертая',
    lastLabel:'Последняя',
    everyLabel:'',
    ofLabel:'',
};

const ConfirmationDialogMessages = {
    discardButton: 'Discard',
    deleteButton: 'Удалить',
    cancelButton: 'Отменить',
    confirmDeleteMessage: 'Вы уверены, что хотите удалить это событие?',
    confirmCancelMessage: 'Отменить несохраненные изменения?',
};

const EditRecurrenceMenuMessages = {
    current:'Это событие',
    currentAndFollowing:'Это и последующие события',
    all:'Все события',
    menuEditingTitle:'Изменить повторяющееся событие',
    menuDeletingTitle:'Удалить повторяющееся событие',
    cancelButton:'Отмена',
    commitButton:'OK',
};

const TodayButtonMessages ={
    today: 'Сегодня',
}



export default class Weekly extends React.PureComponent {

    componentDidMount(){
        document.title = 'Планирование переговорной';
        /*this.getDate().catch((error) => {
            console.error(error);
        });*/
        this.interval = setInterval(() => this.getDate(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    constructor(props) {
        super(props);

        //http://192.168.100.140:8080/myapp/servlets/servlet/HelloWorldExample

        //const appointments = localStorage.getItem('appointments');
        this.state = {
            data: [],
            //data: appointments ? JSON.parse(appointments) : [],
            resources: [
                {
                    fieldName: 'ColorId',
                    title: 'Выберите цвет',
                    instances: resourcesData,
                },
            ],
        };
        this.commitChanges = this.commitChanges.bind(this);
    }


    async getDate() {
        /*
        fetch('http://192.168.100.140:8080/myapp/servlets/servlet/HelloWorldExample', {mode: 'cors'})
        .then((response) => {
                return response.json();
            })
        .then((responseJson) => {
            this.setState({
                data: responseJson
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }
        */

        const response = await fetch('http://192.168.17.96:8080/myapp/servlets/servlet/HelloWorldExample');
        const responseJson = await response.json();

        responseJson.forEach(function (item) {
            item.startDate = new Date(item.startDate);
            item.endDate = new Date(item.endDate);
        })

        this.setState({data: responseJson})
    }


    commitChanges({added, changed, deleted})
    {
        this.setState((state) => {
            let {data} = state;
            if (added) {
                const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, {id: startingAddedId, ...added}];
                //localStorage.setItem('appointments', JSON.stringify(data));
                fetch('http://192.168.17.96:8080/myapp/servlets/servlet/HelloWorldExample',
                    {
                        method: 'POST',
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                        body: JSON.stringify(data),
                    }
                )
                    .then(response => response.json());
            }
            if (changed) {
                data = data.map(appointment => (
                    changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment));
                //localStorage.setItem('appointments', JSON.stringify(data));
                fetch('http://192.168.17.96:8080/myapp/servlets/servlet/HelloWorldExample',
                    {
                        method: 'POST',
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                        body: JSON.stringify(data),
                    }
                )
                    .then(response => response.json());
            }
            if (deleted !== undefined) {
                data = data.filter(appointment => appointment.id !== deleted);
                //localStorage.setItem('appointments', JSON.stringify(data));
                fetch('http://192.168.17.96:8080/myapp/servlets/servlet/HelloWorldExample',
                    {
                        method: 'POST',
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                        body: JSON.stringify(data),
                    }
                )
                    .then(response => response.json());
            }
            return {data};
        });
    }

    render()
    {

        const {data, resources} = this.state;

        return (
            <div style={{
                border: '1px solid rgba(224, 224, 224, 1)',
            }}>
                <Scheduler
                    data={data}
                    locale={'ru-RU'}
                    firstDayOfWeek={1}
                >
                    <ViewState/>
                    <EditingState
                        onCommitChanges={this.commitChanges}
                    />
                    <IntegratedEditing/>
                    <EditRecurrenceMenu
                        messages={EditRecurrenceMenuMessages}
                    />
                    <Toolbar/>
                    <DateNavigator/>
                    <TodayButton
                        messages={TodayButtonMessages}
                    />
                    <WeekView

                        excludedDays={[0, 6]}
                        //intervalCount
                        cellDuration={30}
                        startDayHour={8}
                        endDayHour={20}
                        //layoutComponent
                        //timeScaleLayoutComponent
                        //timeScaleLabelComponent
                        //timeScaleTickCellComponent
                        //dayScaleLayoutComponent
                        dayScaleCellComponent={DayScaleCell}
                        //dayScaleRowComponent
                        //dayScaleEmptyCellComponent
                        //timeTableLayoutComponent
                        //timeTableCellComponent
                        //timeTableRowComponent
                        //appointmentLayerComponent
                    />
                    <Appointments
                        containerComponent={AppointmentContainer}
                        appointmentComponent={Appointment}
                    />
                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                        showDeleteButton
                    />
                    <AppointmentForm
                        basicLayoutComponent={BasicLayoutAppointmentForm}
                        textEditorComponent={TextEditorAppointmentForm}
                        messages={AppointmentFormMessages}
                    />
                    <Resources
                        data={resources}
                    />
                    <ConfirmationDialog
                        ignoreCancel
                        messages={ConfirmationDialogMessages}
                    />

                </Scheduler>

            </div>
        );
    }
}


/*
fetch('http://192.168.100.140:8080/myapp/servlets/servlet/HelloWorldExample',
        {method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)}
        )
        .then(response => response.json());
 */